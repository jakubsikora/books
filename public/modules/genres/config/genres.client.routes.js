'use strict';

//Setting up route
angular.module('genres').config(['$stateProvider',
	function($stateProvider) {
    $stateProvider.
      state('listGenres', {
        url: '/genres',
        templateUrl: 'modules/genres/views/list-genres.client.view.html'
      });
  }
]);