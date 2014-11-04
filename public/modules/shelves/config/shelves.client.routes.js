'use strict';

//Setting up route
angular.module('shelves').config(['$stateProvider',
	function($stateProvider) {
		// Shelves state routing
		$stateProvider.
		state('listShelves', {
			url: '/shelves',
			templateUrl: 'modules/shelves/views/list-shelves.client.view.html'
		}).
		state('createShelf', {
			url: '/shelves/create',
			templateUrl: 'modules/shelves/views/create-shelf.client.view.html'
		}).
		state('viewShelf', {
			url: '/shelves/:shelfId',
			templateUrl: 'modules/shelves/views/view-shelf.client.view.html'
		}).
		state('editShelf', {
			url: '/shelves/:shelfId/edit',
			templateUrl: 'modules/shelves/views/edit-shelf.client.view.html'
		});
	}
]);