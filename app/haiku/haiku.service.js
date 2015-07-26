angular.module('haikuEx.haiku')

.service('Haiku', ['$log', '$http', '$q', function ($log, $http, $q){
	function Haiku(haikuData){
		_.extend(this, haikuData);
		this.getEntities().then(function(){
			console.log('completed getEntities for:', haikuData);
		})
	}
	Haiku.prototype = {
		getSentiment:function(){
			if(this.sentiment){
				return this.sentiment;
			}
			//TODO: Handle loading sentiment from external api
		},
		getImage:function(){
			var endpoint = "https://api.gettyimages.com/v3/search/images/creative?phrase=" + this.entites[0].matchedText;
			console.log('image url:', endpoint);
			var req = {method:'GET', url:endpoint, headers:{"Api-Key":"28anwbn4mdgf3cmbw93zke9m"}}
			$http(req).then(function (res){
				console.log('response:', res);
			}, function (err){
				console.error('Error:', err);
			})
		},
		//Direct request to textrazor for word entity breakdown
		//NOTE: TextRazor API was not allowing localhost or S3 hosted app to make requests. 
		//			This is was one reason for the node server.
		getEntities:function(){
			var d = $q.defer();
			var req = {
				method:'POST', 
				url:"http://api.textrazor.com/",
				headers:{
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        }, 
        data: {
        	apiKey:"0ae1cb4e2f359fcb91c2979640bb3da8d3c469babb7f2953495d520d", 
        	extractors:"entities", 
        	text:this.lines.join(" ")
        }
      };
			console.log('request obj:', req);
			$http(req).then(function (res){
				console.log('response:', res);
				d.resolve(res.data);
			}, function (err){
				console.error('Error:', err);
				d.reject();
			});
			return d.promise;
		}
	}
	return Haiku;
}])
// .factory('HaikuListFactory', ['$log', '$firebaseArray', function ($log, $firebaseArray){
// 	return $firebaseArray.$extend({

// 	});
// }])
//References location based on app name and returns extended firebaseArray

.factory('HaikuList', [ 'Haiku', function ( Haiku){
	var list = [
			{
				lines:[
				"An old silent pond...", 
				"A frog jumps into the pond,", 
				"splash! Silence again."
				], 
				sentiment:{confidence:"78", text:"Positive"},
				entites:[ {
        "id": 0,
        "matchingTokens": [
          3
        ],
        "entityId": "Pond",
        "freebaseTypes": [
          "/geography/lake_type",
          "/geography/geographical_feature_category"
        ],
        "confidenceScore": 1.1776,
        "wikiLink": "http://en.wikipedia.org/wiki/Pond",
        "matchedText": "pond",
        "freebaseId": "/m/0184rb",
        "relevanceScore": 0,
        "entityEnglishId": "Pond",
        "startingPos": 14,
        "endingPos": 18,
        "wikidataId": "Q3253281"
      },
      {
        "id": 1,
        "type": [
          "Species",
          "Eukaryote",
          "Animal",
          "Amphibian"
        ],
        "matchingTokens": [
          6
        ],
        "entityId": "Frog",
        "freebaseTypes": [
          "/fictional_universe/character_species",
          "/biology/animal",
          "/visual_art/art_subject",
          "/book/book_subject",
          "/film/film_subject",
          "/biology/organism_classification"
        ],
        "confidenceScore": 1.96404,
        "wikiLink": "http://en.wikipedia.org/wiki/Frog",
        "matchedText": "frog",
        "freebaseId": "/m/09ld4",
        "relevanceScore": 0.128685,
        "entityEnglishId": "Frog",
        "startingPos": 25,
        "endingPos": 29,
        "wikidataId": "Q53636"
      }
				]
			},
			{
				lines:[
				"Autumn moonlight—", 
				"a worm digs silently", 
				"into the chestnut."
				], 
				sentiment:{confidence:"78", text:"Positive"}
			},
			{
				lines:[
				"An old silent pond...", 
				"A frog jumps into the pond,", 
				"splash! Silence again."
				], 
				sentiment:{confidence:"78", text:"Positive"}
			},
			{
				lines:[
				"An old silent pond...", 
				"A frog jumps into the pond,", 
				"splash! Silence again."
				], 
				sentiment:{confidence:"78", text:"Positive"}
			}
		];
		console.log('returning:', _.map(list, function(haiku){
			return new Haiku(haiku);
		}));
		return _.map(list, function(haiku){
			return new Haiku(haiku);
		})
}])
