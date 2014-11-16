'use strict';

//Shelves service used to communicate Shelves REST endpoints
angular.module('shelves').factory('Shelves', ['$resource',
	function($resource) {
		return $resource('shelves/:shelfId', { shelfId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      searchByBookTitle: {
        url: '/shelves/book/:title',
        method: 'GET',
        isArray: true
      }
		});
	}
]);