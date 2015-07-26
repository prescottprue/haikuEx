angular.module('haikuEx.nav')
.controller('NavCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state){
  $scope.logout = function () {
    AuthService.logout().then(function () {
      $scope.showToast("Logout Successful");
      $state.go('home');
    }, function (err){
      console.error('Error logging out:', err);
      $state.go('home');
    });
  };
  $scope.clickTitle = function(){
  	if($rootScope.currentUser){
  		$state.go('apps');
  	} else {
  		$state.go('home');
  	}
  }
}])