'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Books', 'Shelves',
	function($scope, $stateParams, $location, $modal, $log, Authentication, Books, Shelves) {
		$scope.authentication = Authentication;
		$scope.shelves = Shelves.query();

		$scope.data = {
			books: []
		};

		// Create new Book
		$scope.create = function(data) {
			// Create new Book object
			var book = new Books ({
				isbn: data.isbn,
				title: data.title,
				author: data.author,
				publishedDate: data.publishedDate,
				description: data.description,
				pageCount: data.pageCount,
				thumbnail: data.thumbnail,
				coverColour: data.coverColour
			});

			Shelves.get({ shelfId: data.shelf._id }, function(shelf) {
				shelf.books.push(book);
				shelf.$update(
					function(response) {
						$scope.find();
					},
					function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
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
		$scope.update = function(data) {
			console.log(data);
			var book = new Books ({
				isbn: data.isbn,
				title: data.title,
				author: data.author,
				publishedDate: data.publishedDate,
				description: data.description,
				pageCount: data.pageCount,
				thumbnail: data.thumbnail,
				coverColour: data.coverColour
			});

			Shelves.get({ shelfId: data.shelf._id }, function(shelf) {
				debugger;
			});


			// var book = $scope.book;

			// book.$update(function() {
			// 	$location.path('books/' + book._id);
			// }, function(errorResponse) {
			// 	$scope.error = errorResponse.data.message;
			// });
		};

		// Find a list of Books
		$scope.find = function() {
			Books.query().$promise.then(function(result) {
				$scope.data.books = result;
			});
		};

		// Find existing Book
		$scope.findOne = function() {
			$scope.book = Books.get({
				bookId: $stateParams.bookId
			});
		};

		$scope.addShelf = function() {
			Shelves.save({}, {name: $scope.formData.newshelf}, function(response) {
				$scope.shelves = Shelves.query(function(shelf) {
					// Preselect shelf with newly created item
					$scope.formData.shelf = shelf[0];
				});
			}, function(errorResponse) {
				$scope.errorResponse = errorResponse.data.message;
			});
		};

		$scope.modalUpdate = function (size, selectedBook) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/books/views/edit-book.client.view.html',
	      controller: function($scope, $modalInstance, book) {
	      	Shelves.searchByBookTitle({ title: book.title}, function(shelf) {
	      		$scope.formData = book;
						$scope.formData.shelf = shelf[0];
	      	});

	      	$scope.ok = function () {
				    $modalInstance.close($scope.formData);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      },
	      size: size,
	      resolve: {
	        book: function () {
	          return selectedBook;
	        }
	      }
	    });

	    modalInstance.result.then(function (formData) {
	      $scope.update(formData);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

		$scope.modalCreate = function (size) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/books/views/create-book.client.view.html',
	      controller: function($scope, $modalInstance) {
	      	$scope.formData = { };

	      	$scope.ok = function () {
	      		$modalInstance.close($scope.formData);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      },
	      size: size
	    });

	    modalInstance.result.then(function (formData) {
    		$scope.create(formData);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  // Load books
	  $scope.find();
	}
]);