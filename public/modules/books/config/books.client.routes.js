'use strict';

//Setting up route
angular.module('books').config(['$stateProvider',
	function($stateProvider) {
		// Books state routing
		$stateProvider.
		state('listBooks', {
			url: '/books',
			templateUrl: 'modules/books/views/list-books.client.view.html'
		});
	}
]);