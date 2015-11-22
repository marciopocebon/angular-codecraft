var app = angular.module('codecraft', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda',
    'mgcrea.ngStrap',
    'toaster',
    'ngAnimate',
    'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('list', {
            url: '/',
            views: {
                main: {
                    templateUrl: 'templates/list.html',
                    controller: 'PersonListController'
                },
                search: {
                    templateUrl: 'templates/searchform.html',
                    controller: 'PersonListController'
                }
            }
        })
        .state('edit', {
            url: '/edit/:email',
            views: {
                main: {
                    templateUrl: 'templates/edit.html',
                    controller: 'PersonDetailController'
                }
            }
        })
        .state('create', {
            url: '/create/',
            views: {
                main: {
                    templateUrl: 'templates/edit.html',
                    controller: 'PersonCreateController'
                }
            }
        });

    $urlRouterProvider.otherwise('/');
});

app.config(function($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Token 7a37c6d96f31d21ce50d64d37f16cd5cdb9c160c';
    $resourceProvider.defaults.stripTrailingSlashes = false;
    laddaProvider.setOption({
        style: 'expand-right'
    });
    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd/M/yyyy',
        autoclose: true
    });
});

app.factory('Contact', function($resource) {
    return $resource('http://codecraftpro.com/api/samples/v1/contact/:id/', {id:'@id'}, {
        update: {
            method: 'PUT'
        }
    });
});

app.directive('ccSpinner', function (){
    return  {
        restrict: 'AE',
        templateUrl: 'templates/spinner.html',
        scope: {
            'isLoading': '='
        }
    }
});

app.filter("defaultImage", function (){
    return function(input, param) {
        if(!input) {
            return param;
        }
        return input;
    }
});

app.controller('PersonDetailController', function ($scope, $stateParams, $state, ContactService) {

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
});

app.controller('PersonCreateController', function ($scope, $state, ContactService) {

    $scope.contacts = ContactService;
    $scope.mode = 'Create';

    $scope.save = function () {
        $scope.contacts.createContact($scope.contacts.selectedPerson).then(function(){
            $state.go('list');
        });
    }

});

app.controller('PersonListController', function ($scope, ContactService) {

    $scope.search = "";
    $scope.order = "email";
    $scope.contacts = ContactService;

    $scope.loadMore = function () {
        $scope.contacts.loadMore();
    };
});

app.service('ContactService', function (Contact, $q, $rootScope, toaster) {

    var self =  {
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'isSaving': false,
        'selectedPerson': null,
        'ordering': 'name',
        'persons': [],
        'getPerson': function (email) {
            for (var i = 0; i <= self.persons.length; i++){
                var person = self.persons[i];
                if (email == person.email){
                    return person;
                }
            }
        },
        'doSearch': function () {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.loadContacts();
        },
        'doOrder': function () {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.loadContacts();
        },
        'loadContacts': function () {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;

                var params = {
                    page: self.page,
                    search: self.search,
                    ordering: self.ordering
                };

                Contact.get(params, function (data) {
                    angular.forEach(data.results, function(person) {
                        self.persons.push(new Contact(person));
                    })

                    if (!data.next) {
                        self.hasMore = false;
                    }

                    self.isLoading = false;
                });
            }
        },
        'loadMore': function () {
            if (self.hasMore && !self.isLoading) {
                self.page += 1;
                self.loadContacts();
            }
        },
        'updateContact': function (person) {
            d = $q.defer();
            self.isSaving = true
            person.$update().then(function() {
                self.isSaving = false;
                toaster.pop('success', 'Updated ' + person.name);
                d.resolve();
            });
            return d.promise
        },
        'removeContact': function (person) {
            d = $q.defer();
            self.isDeleting = true
            person.$remove().then(function() {
                self.isDeleting = false;
                var index = self.persons.indexOf(person);
                self.persons.splice(index,1);
                self.selectedPerson = null;
                toaster.pop('success', 'Deleted ' + person.name);
                d.resolve();
            });
            return d.promise;
        },
        'createContact': function (person) {
            d = $q.defer();
            self.isSaving = true
            Contact.save(person).$promise.then(function() {
                self.isSaving = false;
                self.hasMore = true;
                self.selectedPerson = null;
                self.persons = [];
                self.loadContacts();
                toaster.pop('success', 'Created ' + person.name);
                d.resolve();
            });

            return d.promise;
        },
        'watchFilters': function () {
            $rootScope.$watch(function () {
                return self.search;
            }, function (newVal) {
                if (angular.isDefined(newVal)) {
                    self.doSearch();
                }
            });

            $rootScope.$watch(function () {
                return self.ordering;
            }, function (newVal) {
                if (angular.isDefined(newVal)) {
                    self.doOrder();
                }
            });
        }
    };

    self.loadContacts();
    self.watchFilters();

    return self;
});


