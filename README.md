# angular-firebase-form

Makes an AJAX request to put a form message into a Firebase location.

## Usage

1. Include `firebaseForm` in app dependencies

    ```js
    var demoApp = angular.module('demoApp', [
      'ngMaterial',
      'firebaseForm'
    ]);
    ```

2. Set Firebase URL for form data in `.config`

    ```js
    demoApp.config(['firebaseFormProvider', function(firebaseFormProvider) {
      firebaseFormProvider.setFirebaseUrl('https://sinanbolel.firebaseio.com/messages');
    }]);
    ```