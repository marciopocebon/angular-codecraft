;(function() {
    'use strict';

    angular
        .module('codecraft')
        .factory('Contact', function($resource) {
            return $resource('http://codecraftpro.com/api/samples/v1/contact/:id/', {id:'@id'}, {
                update: {
                    method: 'PUT'
                }
            });
        });
}());