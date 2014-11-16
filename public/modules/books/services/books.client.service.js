'use strict';

//Books service used to communicate Books REST endpoints
angular.module('books').factory('Books', ['$resource',
	function($resource) {
		return $resource(
      'books/:bookId',
      { bookId: '@_id' },
      {
        update: {
          method: 'PUT'
        },
        searchByName: {
          url: '/books/name/:name',
          method: 'GET',
          isArray: true
        },
        searchByShelf: {
          url: '/books/shelf/:shelfId',
          method: 'GET',
          isArray: true
        }
      }
    );
	}
]);