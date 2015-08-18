var demoApp = angular.module('demoApp', [
  'ngMaterial',
  'ngRoute',
  'firebaseForm'
]);

demoApp.config(['$routeProvider', '$logProvider', 'firebaseFormProvider', function($routeProvider, $logProvider, firebaseFormProvider) {
  $routeProvider.otherwise('/');
  $logProvider.debugEnabled(true);
  firebaseFormProvider.setFirebaseUrl('https://sinanbolel.firebaseio.com/messages');
}]);