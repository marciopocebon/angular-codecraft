var app = angular.module('codecraft', [
    'ngResource',
    'infinite-scroll',
    'angularSpinner',
    'jcs-autoValidate',
    'angular-ladda'
]);

app.config(function($httpProvider, $resourceProvider, laddaProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Token 7a37c6d96f31d21ce50d64d37f16cd5cdb9c160c';
    $resourceProvider.defaults.stripTrailingSlashes = false;
    laddaProvider.setOption({
        style: 'expand-right'
    });
});

app.factory('Contact', function($resource) {
    return $resource('http://codecraftpro.com/api/samples/v1/contact/:id/', {id:'@id'}, 
    {
        update: {
            method: 'PUT'
        }
    });
});

app.controller('PersonDetailController', function ($scope, ContactService) {
    $scope.contacts = ContactService;

    $scope.save = function () {
        $scope.contacts.updateContact($scope.contacts.selectedPerson);
    }
});

app.controller('PersonListController', function ($scope, ContactService) {

    $scope.search = "";
    $scope.order = "email";
    $scope.contacts = ContactService;

    $scope.loadMore = function () {
        $scope.contacts.loadMore();
    };

    $scope.$watch('search', function (newVal, oldVal) {
        if (angular.isDefined(newVal)){
            $scope.contacts.doSearch(newVal);
        }
    });

    $scope.$watch('order', function (newVal, oldVal) {
        if (angular.isDefined(newVal)){
            $scope.contacts.doOrder(newVal);
        }
    });
});

app.service('ContactService', function (Contact) {

    var self =  {
        'addPerson': function (person) {
            this.persons.push(person);
        },
        'page': 1,
        'hasMore': true,
        'isLoading': false,
        'isSaving': false,
        'selectedPerson': null,
        'persons': [],
        'doSearch': function (search) {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.search = search;
            self.loadContacts();
        },
        'doOrder': function (order) {
            self.hasMore = true;
            self.page = 1;
            self.persons = [];
            self.ordering = order;
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
            self.isSaving = true
            person.$update().then(function() {
                self.isSaving = false;
            });
        }
    };

    self.loadContacts();
    return self;
});


