'use strict';

// Shelves controller
angular.module('shelves').controller('ShelvesController', ['$scope', '$stateParams', '$location', '$modal', '$log', 'Authentication', 'Shelves',
	function($scope, $stateParams, $location, $modal, $log, Authentication, Shelves ) {
		$scope.authentication = Authentication;

		// Create new Shelf
		$scope.create = function() {
			// Create new Shelf object
			var shelf = new Shelves ({
				name: this.name
			});

			// Redirect after save
			shelf.$save(function(response) {
				$location.path('shelves/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Shelf
		$scope.remove = function( shelf ) {
			if ( shelf ) { shelf.$remove();

				for (var i in $scope.shelves ) {
					if ($scope.shelves [i] === shelf ) {
						$scope.shelves.splice(i, 1);
					}
				}
			} else {
				$scope.shelf.$remove(function() {
					$location.path('shelves');
				});
			}
		};

		// Update existing Shelf
		$scope.update = function(updatedShelf) {
			var shelf = updatedShelf;

			shelf.$update(function() {
				//$location.path('shelves/' + shelf._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Shelves
		$scope.find = function() {
			$scope.shelves = Shelves.query();
		};

		// Find existing Shelf
		$scope.findOne = function() {
			$scope.shelf = Shelves.get({
				shelfId: $stateParams.shelfId
			});
		};

		$scope.modalUpdate = function (size, selectedShelf) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/shelves/views/edit-shelf.client.view.html',
	      controller: function($scope, $modalInstance, shelf) {
	      	$scope.shelf = shelf;

	      	$scope.ok = function () {
				    $modalInstance.close($scope.shelf);
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

	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	}
]);