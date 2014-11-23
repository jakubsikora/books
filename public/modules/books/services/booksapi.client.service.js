'use strict';

angular.module('books').factory('BooksAPI', ['$http',
	function($http) {
		// Booksapi service logic
		// ...

		// Public API
		return {
			searchBooks: function searchBooks(query, callback) {
		    $http.get('https://www.googleapis.com/books/v1/volumes', { params: { q: query } })
	        .success(function (data) {
	        	callback(null, data);
	        })
	        .error(function (e) {
          	callback(e);
	        });
			}
		};
	}
]);