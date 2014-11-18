'use strict';

//Shelves service used to communicate Shelves REST endpoints
angular.module('shelves').factory('Shelves', ['$resource',
	function($resource) {
		return $resource('shelves/:shelfId', { shelfId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      default: {
        url: '/shelves/default',
        method: 'GET'
      },
      byBook: {
        url: '/shelves/book/:bookId',
        method: 'GET',
        isArray: true
      },
      createBook: {
        url: '/shelves/:shelfId/books',
        params: { shelfId: '@_id' },
        method: 'PUT'
      },
      updateBook: {
        url: '/shelves/:shelfId/books/:bookId',
        params: { shelfId: '@_id', bookId: '@bookId' },
        method: 'PUT'
      },
      deleteBook: {
        url: '/shelves/:shelfId/books/:bookId',
        params: { shelfId: '@_id', bookId: '@bookId' },
        method: 'DELETE'
      },
      readBooks: {
        url: '/shelves/books',
        method: 'GET',
        isArray: true
      },

		});
	}
]);