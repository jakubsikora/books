'use strict';

// Shelves controller
angular.module('shelves').controller('ShelvesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shelves',
	function($scope, $stateParams, $location, Authentication, Shelves ) {
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
		$scope.update = function() {
			var shelf = $scope.shelf ;

			shelf.$update(function() {
				$location.path('shelves/' + shelf._id);
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
	}
]);