'use strict';

// Genres controller
angular.module('genres').controller('GenresController', ['$scope', '$stateParams', '$location', '$translate', '$timeout', '$modal', '$log', 'Authentication', 'Genres',
	function($scope, $stateParams, $location, $translate, $timeout, $modal, $log, Authentication, Genres ) {
		$scope.authentication = Authentication;

		$scope.data = {
			genres: [],
			alert: null,
			size: {}
		};

		// Create new Genre
		$scope.create = function(data) {
			// Create new Genre object
			var genre = new Genres ({
				name: data.name
			});

			// Redirect after save
			genre.$save(function(response) {
				$scope.find();
				// TODO: service for alerts
				$translate('Book genre has been created.').then(function (alert) {
			    $scope.data.alert = alert;

			    $timeout(function() {
            $scope.data.alert = null;
          }, 3000);
			  });

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Genre
		$scope.remove = function(genre) {
			if (genre) {
				genre.$remove();

				// TODO: service for alerts
				$translate('Book genre has been deleted.').then(function (alert) {
			    $scope.data.alert = alert;

			    $timeout(function() {
            $scope.data.alert = null;
          }, 3000);
			  });

				for (var i in $scope.data.genres ) {
					if ($scope.data.genres [i] === genre ) {
						$scope.data.genres.splice(i, 1);
					}
				}
			}
		};

		// Update existing Genre
		$scope.update = function(updatedGenre) {
			var shelf = updatedGenre;

			shelf.$update(function() {
				$scope.find();

				// TODO: service for alerts
				$translate('Shelf has been updated.').then(function (alert) {
			    $scope.data.alert = alert;

			    $timeout(function() {
            $scope.data.alert = null;
          }, 3000);
			  });
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Genre
		$scope.findOne = function() {
			$scope.genre = Genres.get({
				genreId: $stateParams.genreId
			});
		};

		$scope.modalCreate = function (size) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/genres/views/create-genre.client.view.html',
	      controller: function($scope, $modalInstance) {
	      	$scope.formData = {};

	      	$scope.ok = function () {
	      		if (this.form.createGenreForm.$valid) {
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

		$scope.modalUpdate = function (size, selectedGenre) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/genres/views/edit-genre.client.view.html',
	      controller: function($scope, $modalInstance, genre) {
	      	$scope.formData = genre;

	      	$scope.ok = function () {
				    if (this.form.updateGenreForm.$valid) {
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
	        genre: function () {
	        	return selectedGenre;
	        }
	      }
	    });

	    modalInstance.result.then(function (formData) {
	      $scope.update(formData);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

	  $scope.modalDelete = function (size, selectedGenre) {
	    var modalInstance = $modal.open({
	      templateUrl: 'modules/genres/views/delete-genre.client.view.html',
	      controller: function($scope, $modalInstance, genre) {
	      	$scope.formData = genre;

	      	$scope.ok = function () {
				    $modalInstance.close($scope.formData);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      },
	      size: size,
	      resolve: {
	        genre: function () {
	          return selectedGenre;
	        }
	      }
	    });

	    modalInstance.result.then(function (formData) {
	    	$scope.remove(formData);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };

		// Find a list of Genres
		$scope.find = function() {
			Genres.query().$promise.then(function(genres) {
				$scope.data.genres = genres;

				Genres.getSize().$promise.then(function(sizes) {
					$scope.data.sizes = sizes;
				});
			});
		};

		$scope.find();
	}
]);