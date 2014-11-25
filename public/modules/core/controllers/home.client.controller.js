'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Shelves',
	function($scope, Authentication, Shelves) {
    var that = this;
		// This provides Authentication context.
		$scope.authentication = Authentication;

    // TODO: move active check to the backend
    Shelves.query().$promise.then(function(shelves) {
      $scope.shelves = shelves;

      $scope.flattenBooks = [];
      var booksIndex = 0;

      angular.forEach(shelves, function(shelf) {
        if (shelf.active) {
          angular.forEach(shelf.books, function(book, i) {
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
              shelfName: shelf.name,
              bookEnd: false
            });

            // Insert book end
            if (shelf.books.length - 1 === i) {
              $scope.flattenBooks.push({
                bookEnd: true
              });
            }

            booksIndex++;
          });
        }
      });

      // Fallback
      if (booksIndex === 0) {
        $scope.flattenBooks.push({
          bookPlaceholder: true
        });
      }
    });

    var randomIntFromInterval = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    //TODO, order, sort, pagination
  }
]);