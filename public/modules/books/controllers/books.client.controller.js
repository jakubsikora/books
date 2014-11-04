'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Books', 'Shelves',
	function($scope, $stateParams, $location, Authentication, Books, Shelves ) {
		$scope.authentication = Authentication;
		$scope.shelves = Shelves.query();

		// Create new Book
		$scope.create = function() {
			// Create new Book object
			var book = new Books ({
				name: this.name,
				shelf: this.shelf
			});

			// Redirect after save
			book.$save(function(response) {
				$location.path('books/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Book
		$scope.remove = function( book ) {
			if ( book ) { book.$remove();

				for (var i in $scope.books ) {
					if ($scope.books [i] === book ) {
						$scope.books.splice(i, 1);
					}
				}
			} else {
				$scope.book.$remove(function() {
					$location.path('books');
				});
			}
		};

		// Update existing Book
		$scope.update = function() {
			var book = $scope.book ;

			book.$update(function() {
				$location.path('books/' + book._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Books
		$scope.find = function() {
			$scope.books = Books.query();
		};

		// Find existing Book
		$scope.findOne = function() {
			$scope.book = Books.get({
				bookId: $stateParams.bookId
			});
		};

		$scope.addShelf = function() {
			Shelves.save({}, {name: $scope.newshelf}, function(response) {
				$scope.shelves = Shelves.query();
				console.log('shelf added');
			}, function(errorResponse) {
				$scope.errorResponse = errorResponse.data.message;
			});
		};
	}
]);