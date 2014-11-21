'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Shelves',
	function($scope, Authentication, Shelves) {
    var that = this;
		// This provides Authentication context.
		$scope.authentication = Authentication;

    Shelves.query().$promise.then(function(shelves) {
      $scope.shelves = shelves;

      $scope.flattenBooks = [];
      var booksIndex = 0;

      angular.forEach(shelves, function(shelf) {
        angular.forEach(shelf.books, function(book, i) {
          if (!shelf.default) {
            $scope.flattenBooks.push({
              title: book.title,
              author: book.author,
              isbn: book.isbn,
              fontColour: book.fontColour,
              coverColour: book.coverColour,
              pageCount: book.pageCount,
              sizeHeight: '25px',
              sizeWidth: randomIntFromInterval(110, 190) + 'px',
              publishedDate: book.publishedDate,
              description: book.description,
              shelf_name: shelf.name,
              book_end: false
            });

            // Insert book end
            if (shelf.books.length - 1 === i) {
              $scope.flattenBooks.push({
                book_end: true
              });
            }

            booksIndex++;
          }
        });
      });

      // Fallback
      if (booksIndex === 0) {
        $scope.flattenBooks.push({
          book_placeholder: true
        });
      }
    });

    var randomIntFromInterval = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    //TODO, order, sort, pagination
  }
]);