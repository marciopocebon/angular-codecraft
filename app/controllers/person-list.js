;(function() {
    'use strict';

    angular
        .module('codecraft')
        .controller('PersonListController', function ($scope, ContactService) {
            $scope.search = "";
            $scope.order = "email";
            $scope.contacts = ContactService;

            $scope.loadMore = function () {
                $scope.contacts.loadMore();
            };
        });
}());

