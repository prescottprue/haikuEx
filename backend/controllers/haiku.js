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
	console.log('get haiku experience request:', req.params);
  // An object of options to indicate where to post to
  if(req.body.content){
  	var h = new Haiku(req.body.content);
  	h.getUrls().then(function(entities){
  		console.log('entities with urls:', entities);
  		res.json(entities);
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
		getEntities:function(){
			var d = q.defer();
			var self = this;
			getEntitiesForContent(this.content).then(function(textEntities){
				console.log('entities returned:', textEntities);
				self.entities = textEntities;
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


			this.getEntities().then(function(entities){
				var promiseArray = [];
				console.log('-----------------got entities:', entities);
				_.each(entities, function(entity){
					var dImg = q.defer();
					promiseArray.push(dImg.promise);
					console.log('---------calling getImageUrls for:', entity.entityId);
					getImageUrls(entity.entityId).then(function(imageArray){
						console.log('got Image array:', imageArray);
						entity.images = imageArray;
						dImg.resolve(entity);
					}, function(err){
						dImg.reject(err);
					});
				});
				q.all(promiseArray).then(function(out){
					self.entities = out;
					console.log('FINAL RESULT --------- ',  self);
					d.resolve(self);
				});
			});

			return d.promise;
		}
	}
function getEntitiesForContent(content){
	var d = q.defer();
	if(content){
  	var reqData = {
	   	apiKey:"0ae1cb4e2f359fcb91c2979640bb3da8d3c469babb7f2953495d520d", 
	  	extractors:"entities", 
	  	text:content
		};
		console.log('get entities request:', reqData);
		request.post({url:"http://api.textrazor.com",form:reqData}, function(error, response, body){
		  console.log(body, response);
		  d.resolve(JSON.parse(body).response.entities);
		});
  } else {
  	res.status(400).send('content is required to get haiku experience');
  }
	return d.promise;
}
function getImageUrls(searchTerm){
	var d = q.defer();
	//Search for images with an api key and show the output
	var apiKey = '6fnmbhyh5unehr82bvew8zcd';
  var reqData = {
    url:"https://api.gettyimages.com/v3/search/images/creative?phrase=" + searchTerm,
    headers:{"Api-Key": apiKey}
	};
	request(reqData, function(error, response, body){
	  console.log(body, response);
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
