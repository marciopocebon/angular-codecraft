angular
    .module('codecraft')
    .service('ContactService', function (Contact, $q, $rootScope, toaster) {

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