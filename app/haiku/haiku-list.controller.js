angular.module('haikuEx.haiku')
.controller('HaikuListCtrl', ['$scope','$log',  'HaikuList', function ($scope, $log, HaikuList){

		console.log('ApplicationListController');
		$scope.haikuList = HaikuList;

}])