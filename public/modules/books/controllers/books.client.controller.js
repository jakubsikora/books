'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Shelves',
	function($scope, $stateParams, $location, $modal, $log, Authentication, Shelves) {
		$scope.authentication = Authentication;
		$scope.shelves = Shelves.query();

		$scope.data = {
			shelves: []
		};

		// Create new Book
		$scope.create = function(data) {
			Shelves.get({ shelfId: data.shelf._id }).$promise.then(function(shelf) {
				shelf.$createBook({
					isbn: data.isbn,
					title: data.title,
					author: data.author,
					publishedDate: data.publishedDate,
					description: data.description,
					pageCount: data.pageCount,
					thumbnail: data.thumbnail,
					coverColour: data.coverColour,
					fontColour: data.fontColour
				},
					function(response) {
						$scope.find();
					},
					function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
			});
		};

		// Remove existing Book
		$scope.remove = function(formData) {
			formData.shelf.$deleteBook({ 'bookId': formData._id},
				function(response) {
					$scope.find();
				},
				function(errorResponse) {
					$scope.error = errorResponse.data.message;
			});

		};

		// Update existing Book
		$scope.update = function(data) {
			Shelves.get({ shelfId: data.shelf._id }).$promise.then(function(shelf) {
				shelf.$updateBook({ 'bookId': data._id,
					isbn: data.isbn,
					title: data.title,
					author: data.author,
					publishedDate: data.publishedDate,
					description: data.description,
					pageCount: data.pageCount,
					thumbnail: data.thumbnail,
					coverColour: data.coverColour,
					fontColour: data.fontColour
				},
					function(response) {
						$scope.find();
					},
					function(errorResponse) {
						$scope.error = errorResponse.data.message;
					});
			});
		};

		// Find a list of Books
		$scope.find = function() {
			Shelves.query().$promise.then(function(shelves) {
      	$scope.data.shelves = shelves;
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
	      	Shelves.byBook({ bookId: book._id}, function(shelf) {
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

	  $scope.modalDelete = function (size, selectedShelf, selectedBook) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/books/views/delete-book.client.view.html',
	      controller: function($scope, $modalInstance, book, shelf) {
	      	$scope.formData = book;
	      	$scope.formData.shelf = shelf;

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
	        },
	        shelf: function () {
	          return selectedShelf;
	        }
	      }
	    });

	    modalInstance.result.then(function (formData) {
	    	$scope.remove(formData);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

		$scope.modalCreate = function (size) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/books/views/create-book.client.view.html',
	      controller: function($scope, $modalInstance) {
	      	$scope.formData = { };
	      	$scope.formData.fontColour = '#FFFFFF';
	      	$scope.formData.coverColour = '#000000';

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