'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Shelves',
	function($scope, Authentication, Shelves) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

    Shelves.query().$promise.then(function(shelves) {
      $scope.shelves = shelves;

      $scope.flattenBooks = [];
      var booksIndex = 0;

      angular.forEach(shelves, function(shelf) {
        angular.forEach(shelf.books, function(book, i) {
          $scope.flattenBooks.push({
            title: book.title,
            author: book.author,
            ISBN: book.ISBN,
            shelf_name: shelf.name,
            book_end: false
          });

          // Insert book end
          if (shelf.books.length - 1 === i) {
            $scope.flattenBooks.push({
              book_end: true
            });
          }
        });
      });
    });

    //TODO, order, sort, pagination
  }
]);