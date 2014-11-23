'use strict';

(function() {
	// Genres Controller Spec
	describe('Genres Controller Tests', function() {
		// Initialize global variables
		var GenresController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Genres controller.
			GenresController = $controller('GenresController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Genre object fetched from XHR', inject(function(Genres) {
			// Create sample Genre using the Genres service
			var sampleGenre = new Genres({
				name: 'New Genre'
			});

			// Create a sample Genres array that includes the new Genre
			var sampleGenres = [sampleGenre];

			// Set GET response
			$httpBackend.expectGET('genres').respond(sampleGenres);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.genres).toEqualData(sampleGenres);
		}));

		it('$scope.findOne() should create an array with one Genre object fetched from XHR using a genreId URL parameter', inject(function(Genres) {
			// Define a sample Genre object
			var sampleGenre = new Genres({
				name: 'New Genre'
			});

			// Set the URL parameter
			$stateParams.genreId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/genres\/([0-9a-fA-F]{24})$/).respond(sampleGenre);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.genre).toEqualData(sampleGenre);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Genres) {
			// Create a sample Genre object
			var sampleGenrePostData = new Genres({
				name: 'New Genre'
			});

			// Create a sample Genre response
			var sampleGenreResponse = new Genres({
				_id: '525cf20451979dea2c000001',
				name: 'New Genre'
			});

			// Fixture mock form input values
			scope.name = 'New Genre';

			// Set POST response
			$httpBackend.expectPOST('genres', sampleGenrePostData).respond(sampleGenreResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Genre was created
			expect($location.path()).toBe('/genres/' + sampleGenreResponse._id);
		}));

		it('$scope.update() should update a valid Genre', inject(function(Genres) {
			// Define a sample Genre put data
			var sampleGenrePutData = new Genres({
				_id: '525cf20451979dea2c000001',
				name: 'New Genre'
			});

			// Mock Genre in scope
			scope.genre = sampleGenrePutData;

			// Set PUT response
			$httpBackend.expectPUT(/genres\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/genres/' + sampleGenrePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid genreId and remove the Genre from the scope', inject(function(Genres) {
			// Create new Genre object
			var sampleGenre = new Genres({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Genres array and include the Genre
			scope.genres = [sampleGenre];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/genres\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGenre);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.genres.length).toBe(0);
		}));
	});
}());