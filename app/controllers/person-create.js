;(function() {
    'use strict';

    angular
        .module('codecraft')
        .controller('PersonCreateController', function ($scope, $state, ContactService) {
            $scope.contacts = ContactService;
            $scope.mode = 'Create';

            $scope.save = function () {
                $scope.contacts.createContact($scope.contacts.selectedPerson).then(function(){
                    $state.go('list');
                });
            }
        });
}());
