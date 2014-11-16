'use strict';

// Core module config
angular.module('core').config(['$translateProvider',
	function($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/locale-',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
    // try to find out preferred language by yourself
    //$translateProvider.determinePreferredLanguage();

    // English as fallback language
    $translateProvider.fallbackLanguage('en');

    // Store choosen language in the cookies
    $translateProvider.useCookieStorage();
	}
]);