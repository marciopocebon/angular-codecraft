var app = angular.module('minmax', []);

app.controller('MinMaxCtrl', function($scope){
    $scope.formModel = {};

    $scope.onSubmit = function() {
        console.log('Hey Im submitted');
        console.log($scope.formModel);
    }
});