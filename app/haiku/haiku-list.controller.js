angular.module('haikuEx.haiku')
.controller('HaikuListCtrl', ['$scope','$log',  'HaikuList', function ($scope, $log, HaikuList){

		console.log('ApplicationListController');
		$scope.haikuList = HaikuList;
		$scope.showSmiley = function(num){
			if(parseInt(num) >= 50){
				return true;
			} else {
				return false;
			}
		};
}])