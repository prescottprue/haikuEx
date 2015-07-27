angular.module('haikuEx.nav')
.controller('NavCtrl', ['$rootScope', '$scope', '$state', '$mdDialog', function ($rootScope, $scope, $state, $mdDialog){
  $scope.showDialog = function(ev) {
    $mdDialog.show({
      controller: function($scope, $mdDialog){
        $scope.create = function(answer){
          console.log('Answered:', answer);
          $mdDialog.hide(answer);
        };
        $scope.cancel = function(){
          $mdDialog.hide();
        };
      },
      templateUrl: './haiku/haiku-new.html',
      parent: angular.element(document.body),
      targetEvent: ev,
    })
    .then(function(answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
  $scope.startNew = function(ev){
    $scope.showDialog(ev);
    // $state.go('haiku-new');
  }
}])