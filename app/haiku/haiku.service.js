angular.module('haikuEx.haiku')

.service('Haiku', ['$log', '$http', '$q', function ($log, $http, $q){
	function Haiku(haikuData){
		_.extend(this, haikuData);
	}
	Haiku.prototype = {
		//--------- HaikuEx API Requests
		getExperience:function(){
			var d = $q.defer();
			var self = this;
			console.log('this:', this);
			$http.post('/haiku', {content:this.lines.join("")}).then(function (res){
				console.log('response:', res);
				self.experience = res.data;
				d.resolve(self);
			}, function (err){
				console.error('Error:', err);
				d.reject(err);
			});
			return d.promise;
		},
		//-------- Seperate Requests all from client to build list
		getSentiment:function(){
			if(this.sentiment){
				return this.sentiment;
			}
			//TODO: Handle loading sentiment from external api
		},
		getImage:function(){
			var d = $q.defer();
			var endpoint = "https://api.gettyimages.com/v3/search/images/creative?phrase=" + this.entites[0].matchedText;
			console.log('image url:', endpoint);
			var req = {method:'GET', url:endpoint, headers:{"Api-Key":""}}
			$http(req).then(function (res){
				console.log('response:', res);
			}, function (err){
				console.error('Error:', err);
			});
		},
		//Direct request to textrazor for word entity breakdown
		// NOTE: TextRazor API was not allowing localhost or S3 hosted app to make requests. 
		// 			This is was one reason for the node server.
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
				entityIds: [
			    "Pond",
			    "Frog"
			  ],
				entities:[ 
					{
	        	entityId: "Pond",
	       		images:[ 
	       			"http://cache1.asset-cache.net/xt/175824809.jpg?v=1&g=fs1|0|IMS|24|809&s=1&b=RjI4",
	        		"http://cache4.asset-cache.net/xt/525389593.jpg?v=1&g=fs1|0|CUL|89|593&s=1&b=RjI4"
	        	]
      		},
      		{
	        	entityId: "Frog",
	       		images:[ 
	       			 "http://cache2.asset-cache.net/xt/535657961.jpg?v=1&g=fs1|0|ROF|57|961&s=1&b=RjI4",
        "http://cache3.asset-cache.net/xt/535657933.jpg?v=1&g=fs1|0|ROF|57|933&s=1&b=RjI4",
        "http://cache2.asset-cache.net/xt/535657927.jpg?v=1&g=fs1|0|ROF|57|927&s=1&b=RjI4",
        "http://cache4.asset-cache.net/xt/451821011.jpg?v=1&g=fs1|0|DV|21|011&s=1&b=RTRE"
	        	]
      		},

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
		//TODO: Have content loaded from database
		return _.map(list, function(haiku){
			return new Haiku(haiku);
		})
}])
