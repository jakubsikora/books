'use strict';

// Genres controller
angular.module('genres').controller('GenresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Genres',
	function($scope, $stateParams, $location, Authentication, Genres ) {
		$scope.authentication = Authentication;

		// Create new Genre
		$scope.create = function() {
			// Create new Genre object
			var genre = new Genres ({
				name: this.name
			});

			// Redirect after save
			genre.$save(function(response) {
				$location.path('genres/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Genre
		$scope.remove = function( genre ) {
			if ( genre ) { genre.$remove();

				for (var i in $scope.genres ) {
					if ($scope.genres [i] === genre ) {
						$scope.genres.splice(i, 1);
					}
				}
			} else {
				$scope.genre.$remove(function() {
					$location.path('genres');
				});
			}
		};

		// Update existing Genre
		$scope.update = function() {
			var genre = $scope.genre ;

			genre.$update(function() {
				$location.path('genres/' + genre._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Genres
		$scope.find = function() {
			$scope.genres = Genres.query();
		};

		// Find existing Genre
		$scope.findOne = function() {
			$scope.genre = Genres.get({ 
				genreId: $stateParams.genreId
			});
		};
	}
]);