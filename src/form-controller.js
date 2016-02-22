firebaseFormModule.controller('FormController', ['$scope', '$mdToast', '$location', 'MessageFactory', function ($scope, $mdToast, $location, MessageFactory) {

  var toastPosition = {bottom: true, top: false, left: false, right: true};

  var formCallbacks = {
    success: function() {
      $scope.messageData = {};
      $scope.contactForm.$setUntouched();
      $scope.contactForm.$setPristine();
      $mdToast.show($mdToast.simple().content('Sent!').position(getToastPosition()).hideDelay(5000));
    },
    error: function(error) {
      $mdToast.show($mdToast.simple().content('Error!').position(getToastPosition()).hideDelay(5000));
    }
  };
  
  $scope.submit = function() {
    var data = angular.copy($scope.messageData);
    data.location = $location.absUrl();
    var msg = new MessageFactory(data, $scope.contactForm.$valid);
    msg.submit().then(function(){
      formCallbacks.success();
    }).catch(function(error){
      console.error(error);
      formCallbacks.error();
    });
  };
  
  function getToastPosition() {
    return Object.keys(toastPosition).filter(function(pos) {
      return toastPosition[pos];
    }).join(' ');
  }

}]);