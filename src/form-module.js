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