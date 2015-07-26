/**
 * @description Haiku Controller
 */
// var Haiku = require('../models/application').Haiku;
// var mongoose = require('mongoose');
var url = require('url');
var _ = require('underscore');
var q = require('q'),
request = require('request');

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
  	var post_data = {
	   	apiKey:"0ae1cb4e2f359fcb91c2979640bb3da8d3c469babb7f2953495d520d", 
	  	extractors:"entities", 
	  	text:req.body.content
		};
		console.log('postdata:', post_data);
		request.post({url:"http://api.textrazor.com",form:post_data}, function(error, response, body){
		  console.log(body, response);
		  res.json(JSON.parse(body).response.entities);
		});
  } else {
  	res.status(400).send('content is required to get haiku experience');
  }
};
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
