/**
 * @description Haiku Controller
 */
// var Haiku = require('../models/application').Haiku;
// var mongoose = require('mongoose');
var url = require('url');
var _ = require('underscore');
var q = require('q'),
request = require('request');
	var http = require('http');
/**
 * @api {get} /applications Get Haikus list
 * @apiName GetHaiku
 * @apiGroup Haiku
 *
 * @apiParam {String} name Name of Haiku
 *
 * @apiSuccess {Object} applicationData Object containing applications data.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "App1",
 *       "owner": {username:"Doe"}
 *     }
 *
 */
exports.getExperience = function(req, res, next){
  // An object of options to indicate where to post to
  if(req.body.content){
  	var h = new Haiku(req.body.content);
  	h.getUrls().then(function(haikuList){
  		console.log('haikuList with urls:', haikuList);
  		//TODO: Include sentiment
  		res.json(haikuList);
  	}, function(err){
  		res.status(400).send('Error getting urls');
  	});
  } else {
  	res.status(400).send('content is required to get haiku experience');
  }
};
function Haiku(content){
	this.content = content;
}
Haiku.prototype = {
	getExperience:function(){
		//TODO: Get sentiment, entities and matching image urls
		//TODO: Return this with those parameters included
		var d = q.defer();
		var self = this;
		self.getUrls().then(function (entitiesWithImgs){
			self.entities = entitiesWithImgs;
			console.log('getUrls returned:', entitiesWithImgs);
			self.getSentiment().then(function (sentiment){
				self.sentiment = sentiment;
				console.log('getSentiment finished with self:', self);
				d.resolve(self);
			}, function (err){
				console.error('Error getting sentiment:', err);
				d.reject(err);
			});
		}, function (err){
			console.error('Error getting entities:', err);
			d.reject(err);
		});
		return d.promise;
	},
	getSentiment:function(){
		var d = q.defer();
		var self = this;
		getSentiment(this.content).then(function (sentiment){
			console.log('sentiment returned:', sentiment);
			d.resolve(sentiment);
		}, function (err){
			console.error('Error getting entities:', err);
			d.reject(err);
		});
		return d.promise;
	},
	getEntities:function(){
		var d = q.defer();
		var self = this;
		getEntitiesForContent(this.content).then(function(textEntities){
			console.log('entities returned:', textEntities);
			//Remove all entity info except id (used in image search)
			textEntities = _.map(textEntities, function(entity){
  			return _.pick(entity, 'entityId');
  		});
  		console.log('textEntities:', textEntities);
			d.resolve(textEntities);
		}, function (err){
			console.error('Error getting entities:', err);
			d.reject(err);
		});
		return d.promise;
	},
	getUrls:function(){
		var d = q.defer();
		var self = this;
		this.getEntities().then(function (entities){
			//Build entityIds array
			self.entityIds = _.pluck(entities, 'entityId');
			var promiseArray = [];
			_.each(entities, function (entity){
				//Create a promise for each getImageUrls
				var dImg = q.defer();
				promiseArray.push(dImg.promise);
				console.log('---------calling getImageUrls for:', entity.entityId);
				getImageUrls(entity.entityId).then(function (imageArray){
					// console.log('got Image array:', imageArray);
					//Only keep 4 images
					entity.images = _.first(imageArray, 4);
					dImg.resolve(entity);
				}, function (err){
					dImg.reject(err);
				});
			});
			q.all(promiseArray).then(function (out){
				self.entities = out;
				console.log('FINAL RESULT getUrls --------- ',  self);
				d.resolve(self);
			});
		});
		return d.promise;
	}
	}
//Get sentiment
function getSentiment(content){
	var d = q.defer();
	if(content){
  	var reqData = {
	    url:"https://community-sentiment.p.mashape.com/text/",
	    headers:{"X-Mashape-Key": process.env.MASHAPE_KEY},
	    data:"txt="+content
		};
		console.log('get entities request:', reqData);
		request(reqData, function(error, response, body){
		  console.log('getSentimentForContent response:', JSON.parse(body).response);
		  d.resolve(JSON.parse(body).response.entities);
		});
  } else {
  	d.reject({message:'content is required to get haiku sentiment'});
  }
	return d.promise;
}
// Get text breakdown from TextRazor
function getEntitiesForContent(content){
	var d = q.defer();
	if(content){
  	var reqData = {
	   	apiKey:process.env.TEXT_RZR_KEY, 
	  	extractors:"entities,meaning,topics", 
	  	text:content
		};
		console.log('get entities request:', reqData);
		request.post({url:"http://api.textrazor.com",form:reqData}, function(error, response, body){
		  console.log('getEntitiesForContent response:', JSON.parse(body).response);
		  d.resolve(JSON.parse(body).response.entities);
		});
  } else {
  	d.reject({message:'content is required to get haiku experience'})
  }
	return d.promise;
}
//Keywork is used to search for images using GettyImages
function getImageUrls(searchTerm){
	var d = q.defer();
  var reqData = {
    url:"https://api.gettyimages.com/v3/search/images/creative?phrase=" + searchTerm,
    headers:{"Api-Key": process.env.GETTY_IMG_KEY}
	};
	request(reqData, function(error, response, body){
	  // console.log(body, response);
	  var imageArray = JSON.parse(body).images;
	  var uriArray = imageArray.map(function(image){
	  	return image.display_sizes[0].uri;
	  });
	  console.log('URI ARRAY:', uriArray);
	  d.resolve(uriArray);
	});
	return d.promise;
}
/**
 * @api {get} /applications Get Haikus list
 * @apiName GetHaiku
 * @apiGroup Haiku
 *
 * @apiParam {String} name Name of Haiku
 *
 * @apiSuccess {Object} applicationData Object containing applications data.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "name": "App1",
 *       "owner": {username:"Doe"}
 *     }
 *
 */
exports.get = function(req, res, next){
	var isList = true;
	var query = Haiku.find({}).populate({path:'owner', select:'username name title email'});
	if(req.params.name){ //Get data for a specific application
		console.log('application request with id:', req.params.name);
		query = Haiku.findOne({name:req.params.name}).populate({path:'owner', select:'username name title email'});
		isList = false;
	}
	query.exec(function (err, result){
		if(err) { return next(err);}
		if(!result){
			return next (new Error('Haiku could not be found'));
		}
		res.send(result);
	});
};
