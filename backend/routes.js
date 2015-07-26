var express = require('express');
var indexCtrls = require('./controllers/index');
var haikuCtrls = require('./controllers/haiku');


module.exports =  {
	//login(get token)
	//logout (revoke token)
	//signup
	index:[
		{
			type:'GET',
			endpoint:'/',
			controller: indexCtrls.main
		}
	],
	haiku:[
		{
			type:'POST',
			endpoint:'/haiku',
			controller: haikuCtrls.getExperience
		}
	],
	
};
