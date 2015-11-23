angular
    .module('codecraft')
    .config(function($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {
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