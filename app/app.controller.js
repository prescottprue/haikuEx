angular.module('haikuEx')

  .controller('AppCtrl', ['$scope', '$state', '$mdToast', '$mdDialog', 'HaikuList', 'Haiku', function ($scope, $state, $mdToast, $mdDialog, HaikuList, Haiku) {
    $scope.toastPosition = {
      left: false,
      right: true,
      bottom: true,
      top: false
    };
    $scope.haikuList = HaikuList;

    $scope.showDialog = function(ev) {
      $mdDialog.show({
        controller: function($scope, $mdDialog){
          $scope.create = function(answer){
            console.log('Answered:', answer);
            $mdDialog.hide(answer);
          };
          $scope.cancel = function(){
            $mdDialog.cancel();
          };
        },
        templateUrl: './haiku/haiku-new.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      })
      .then(function(answer) {
        $scope.alert = 'You said the information was "' + answer + '".';
        var haiku = new Haiku(answer);
        haiku.getExperience().then(function(newHaiku){
          $scope.haikuList.push(newHaiku);
        });
      }, function() {
        // $scope.alert = 'You cancelled the dialog.';
      });
    };
  $scope.startNew = function(ev){
    $scope.showDialog(ev);
    // $state.go('haiku-new');
  }
  	$scope.getToastPosition = function () {
      return Object.keys($scope.toastPosition).filter(function (pos) { return $scope.toastPosition[pos]; }).join(' ');
    };
    $scope.showToast = function (toastMessage) {
      $mdToast.show(
      	$mdToast.simple().content(toastMessage)
        .position($scope.getToastPosition())
        .hideDelay(3000)
      );
    };
    $scope.showAlert = function(ev, alertObj) {
      // Appending dialog to document.body to cover sidenav in docs app
      var title = alertObj.title || "Alert";
      var description = alertObj.description || "Error, please try again.";
      console.log("showAlert:", ev, alertObj);
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .title(title)
          .content(description)
          // .ariaLabel('Alert Dialog Demo')
          .ok('Got it!')
          .targetEvent(ev)
      );
    };
    $scope.showConfirm = function(ev, confirmObj) {
      // Appending dialog to document.body to cover sidenav in docs app
      var title = confirmObj.title || "Confirm";
      var content = confirmObj.content || confirmObj.description || "Are you sure?";
      var confirmText = confirmObj.confirmText || "Yes";
      var cancelText = confirmObj.cancelText || "Cancel";

      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title(title)
        .content(content)
        .ariaLabel('Lucky day')
        .ok(confirmText)
        .cancel(cancelText)
        .targetEvent(ev);
      return $mdDialog.show(confirm);
    };
  }]);