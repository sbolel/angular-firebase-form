function FirebaseForm (url) {
  this.firebaseUrl = url;
}

/**
 * @ngdoc module
 * @name firebaseForm
 */
var firebaseFormModule = angular.module('firebaseForm',['ngAnimate', 'ngMaterial']);

/**
 * @ngdoc provider
 * @name firebaseFormProvider
 * @description
 *
 *
 */
firebaseFormModule.provider('firebaseForm',[function() {
  var firebaseUrl = null;
  this.setFirebaseUrl = function(url) {
    firebaseUrl = url;
  };
  this.$get = [function FirebaseFormFactory() {
    return new FirebaseForm(firebaseUrl);
  }];
}]);
firebaseFormModule.factory('MessageFactory', ['$q', 'firebaseForm', function ($q, firebaseForm) {
  'use strict';

  var messagesList = new Firebase(firebaseForm.firebaseUrl);

  var MessageRef = function() {
    return messagesList.push();
  };

  var Message = function(data, isValid) {
    this.ref = new MessageRef();
    this.data = data;
    this.data.submitAt = Firebase.ServerValue.TIMESTAMP;
    this.data.submitAtString = Date(this.data.submitAt);
    this.valid = isValid;
    return this;
  };

  Message.prototype.submit = function() {
    var deferred = $q.defer();
    var that = this;
    if (this.valid) {
      this.ref.set(this.data, function(error) {
        if(error) {
          deferred.reject(error);
        } else {
          deferred.resolve(that.data);
        }
      });
    } else {
      deferred.reject('Invalid entry');
    }
    return deferred.promise;
  };

  return function(messageData, messageIsValid){
    return new Message(messageData, messageIsValid);
  };

}]);
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
firebaseFormModule.directive('contactForm', function () {
  return {
    scope: {
      title: '@'
    },
    controller: 'FormController',
    template: '<form name=contactForm ng-submit=submit() layout=column class=mt20 style=margin:auto;width:100%;max-width:640px;> <h4>What\'s your info?</h4> <div layout=row layout-xs=column flex=auto> <md-input-container flex=auto> <label>Name</label> <input type=text ng-model=messageData.name> </md-input-container> <md-input-container flex=auto> <label>Email (required)</label> <input type=email ng-model=messageData.email required> </md-input-container> </div> <h4>What would you like to discuss?</h4> <md-input-container flex> <label>Enter a message (required)</label> <textarea ng-model=messageData.message columns=1 md-maxlength=500 required></textarea> </md-input-container> <div flex layout layout-align="center center" class=mb10> <input class="md-button md-raised md-accent" type=submit id=submit value=Submit> </div> </form>'
  };
});