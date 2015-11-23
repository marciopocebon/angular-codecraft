;(function() {
    'use strict';

    angular
        .module('codecraft')
        .filter("defaultImage", defaultImage);

    function defaultImage (){
        return function(input, param) {
            if(!input) {
                return param;
            }
            return input;
        }
    };
}());
