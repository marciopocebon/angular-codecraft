;(function() {
    'use strict';

    angular
        .module('codecraft')
        .controller('PersonListController', PersonListController);

    PersonListController.$inject = ['$scope', 'ContactService'];

    function PersonListController ($scope, ContactService) {
        $scope.search = "";
        $scope.order = "email";
        $scope.contacts = ContactService;

        $scope.loadMore = function () {
            $scope.contacts.loadMore();
        };
    };
}());

