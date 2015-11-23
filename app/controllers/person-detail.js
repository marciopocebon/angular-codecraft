;(function() {
    'use strict';

    angular
        .module('codecraft')
            .controller('PersonDetailController', PersonDetailController);

    PersonDetailController.$inject = ['$scope', '$stateParams', '$state', 'ContactService'];

    function PersonDetailController ($scope, $stateParams, $state, ContactService) {

        $scope.contacts = ContactService;
        $scope.contacts.selectedPerson = $scope.contacts.getPerson($stateParams.email);
        $scope.mode = 'Edit';

        $scope.save = function () {
            $scope.contacts.updateContact($scope.contacts.selectedPerson).then(function(){
                $state.go('list');
            });
        }

        $scope.remove = function () {
            $scope.contacts.removeContact($scope.contacts.selectedPerson).then(function(){
                $state.go('list');
            });
        }
    };
}());

