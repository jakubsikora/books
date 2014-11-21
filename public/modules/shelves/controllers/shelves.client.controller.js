'use strict';

// Shelves controller
angular.module('shelves').controller('ShelvesController', ['$scope', '$stateParams', '$location', '$modal', '$log', '$translate', 'Authentication', 'Shelves',
	function($scope, $stateParams, $location, $modal, $log, $translate, Authentication, Shelves ) {
		$scope.authentication = Authentication;

		$scope.data = {
			shelves: []
		};

		// Create new Shelf
		$scope.create = function(data) {
			// Create new Shelf object
			var shelf = new Shelves ({
				name: data.name
			});

			// Redirect after save
			shelf.$save(function(response) {
				$scope.find();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Shelf
		$scope.remove = function(shelf) {
			if (shelf) {
				var books = shelf.books;
				if (books) {
					$scope.moveToDefault(books);
				}

				shelf.$remove();

				for (var i in $scope.data.shelves ) {
					if ($scope.data.shelves [i] === shelf ) {
						$scope.data.shelves.splice(i, 1);
					}
				}
			}
		};

		$scope.moveToDefault = function(books) {
			Shelves.default().$promise.then(function(shelf) {
				var defaultBooks = shelf.books;
				defaultBooks = books.concat(defaultBooks);

				// Move books to default
				shelf.books = defaultBooks;
				$scope.update(shelf);
			});
		};

		// Update existing Shelf
		$scope.update = function(updatedShelf) {
			var shelf = updatedShelf;

			shelf.$update(function() {
				$scope.find();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shelves
		$scope.find = function() {
			$scope.data.shelves = Shelves.query();
		};

		// Find existing Shelf
		$scope.findOne = function() {
			$scope.shelf = Shelves.get({
				shelfId: $stateParams.shelfId
			});
		};

		$scope.modalCreate = function (size) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/shelves/views/create-shelf.client.view.html',
	      controller: function($scope, $modalInstance) {
	      	$scope.formData = {};

	      	$scope.ok = function () {
	      		if (this.form.createShelfForm.$valid) {
	      			$modalInstance.close($scope.formData);
      			} else {
      				$translate('Please fill or required fields').then(function (requiredFields) {
						    $scope.error = requiredFields;
						  });
      			}
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

		$scope.modalUpdate = function (size, selectedShelf) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/shelves/views/edit-shelf.client.view.html',
	      controller: function($scope, $modalInstance, shelf) {
	      	$scope.formData = shelf;

	      	$scope.ok = function () {
				    if (this.form.updateShelfForm.$valid) {
	      			$modalInstance.close($scope.formData);
      			} else {
      				$translate('Please fill or required fields').then(function (requiredFields) {
						    $scope.error = requiredFields;
						  });
      			}
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      },
	      size: size,
	      resolve: {
	        shelf: function () {
	        	return selectedShelf;
	        }
	      }
	    });

	    modalInstance.result.then(function (formData) {
	      $scope.update(formData);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  $scope.modalDelete = function (size, selectedShelf) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/shelves/views/delete-shelf.client.view.html',
	      controller: function($scope, $modalInstance, shelf) {
	      	$scope.formData = shelf;

	      	$scope.ok = function () {
				    $modalInstance.close($scope.formData);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      },
	      size: size,
	      resolve: {
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

	  $scope.find();
	}
]);