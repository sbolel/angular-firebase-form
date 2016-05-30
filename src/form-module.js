function FirebaseForm(url) {
  'use strict';
  this.firebaseUrl = url;
}

var firebaseFormModule = angular.module('firebaseForm', ['ngAnimate', 'ngMaterial'])

.provider('firebaseForm', function() {
  'use strict';
  var firebaseUrl = null;
  this.setFirebaseUrl = function(url) {
    firebaseUrl = url;
  };
  this.$get = [function FirebaseFormFactory() {
    return new FirebaseForm(firebaseUrl);
  }];
})

.directive('contactForm', function() {
  'use strict';
  return {
    scope: {
      title: '@'
    },
    controller: 'FormController',
    template: '<form name="contactForm" ng-submit="submit()" layout="column" layout-padding layout-margin class="mt20"><md-input-container flex><label>Name</label><input type="text" ng-model="messageData.name"></md-input-container><md-input-container flex><label>Email (required)</label><input type="email" ng-model="messageData.email" required></md-input-container><md-input-container flex><label>Enter a message (required)</label><textarea ng-model="messageData.message" columns="1" md-maxlength="500" required></textarea></md-input-container><a id="contact-submit" flex layout layout-align="end center" class="mb10"><input class="md-button md-raised md-accent" type="submit" id="submit" value="Submit" ng-disabled="contactForm.$invalid"></a></form>'
  };
})

.controller('FormController', function($scope, $mdToast, $location, MessageFactory) {
  'use strict';
  var toastPosition = { bottom: true, top: false, left: false, right: true };
  $scope.submit = function() {
    var data = angular.copy($scope.messageData);
    data.location = $location.absUrl();
    var msg = new MessageFactory(data, $scope.contactForm.$valid);
    msg.submit().then(function() {
      onFormSuccess();
    }).catch(function(error) {
      onFormError();
    });
  };
  function getToastPosition() {
    return Object.keys(toastPosition).filter(function(pos) {
      return toastPosition[pos];
    }).join(' ');
  }
  function onFormSuccess() {
    $scope.messageData = {};
    $scope.contactForm.$setUntouched();
    $scope.contactForm.$setPristine();
    $mdToast.show($mdToast.simple().content('Your message was sent!').position(getToastPosition()).hideDelay(4000));
  }
  function onFormError(error) {
    console.error(error);
    $mdToast.show($mdToast.simple().content('Sorry, we couldn\'t send your message.').position(getToastPosition()).hideDelay(4000));
  }
})

.factory('MessageFactory', function($q, $http, firebaseForm) {
  'use strict';
  var Message = function(data, isValid) {
    this.data = data;
    this.data.submitAt = new Date();
    this.data.submitAtString = Date(this.data.submitAt);
    this.valid = isValid;
    return this;
  };
  Message.prototype.submit = function() {
    var deferred = $q.defer();
    if(!firebaseForm.firebaseUrl)
      throw new Error('Missing firebaseUrl');
    var that = this;
    if (this.valid) {
      $http({
        method: 'POST',
        url: firebaseForm.firebaseUrl,
        data: JSON.stringify(that.data),
        context: document.body
      }).then(function successCallback(response) {
        deferred.resolve(that.data, response);
      }, function errorCallback(response) {
        deferred.reject(response);
      });
    } else {
      deferred.reject('Invalid entry');
    }
    return deferred.promise;
  };
  return function(messageData, messageIsValid) {
    return new Message(messageData, messageIsValid);
  };
});