'use strict';

//Setting up route
angular.module('shelves').config(['$stateProvider',
	function($stateProvider) {
		// Shelves state routing
		$stateProvider.
		state('listShelves', {
			url: '/shelves',
			templateUrl: 'modules/shelves/views/list-shelves.client.view.html'
		});
	}
]);