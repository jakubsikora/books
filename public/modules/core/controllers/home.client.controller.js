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
              sizeWidth: bookSize(book.pageCount),
              sizeHeight: randomIntFromInterval(110, 190) + 'px',
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

    var bookSize = function(pageCount) {
      var minSize = 15
        , maxSize = 60
        , size = 0;

      size = (parseInt(0.1 * pageCount, 10));

      if (size < minSize) {
        size = minSize;
      } else if (size > maxSize) {
        size = maxSize;
      }

      return size + 'px';
    };
  }
]);