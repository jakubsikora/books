'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'my_books';
	var applicationModuleVendorDependencies = [
		'ngResource',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ui.router',
		'ui.bootstrap',
		'ui.utils',
		'pascalprecht.translate'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('books');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('shelves');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Configuring the Articles module
angular.module('books').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Books', 'books', 'dropdown', '/books(/create)?');
		Menus.addSubMenuItem('topbar', 'books', 'List Books', 'books');
		//Menus.addSubMenuItem('topbar', 'books', 'New Book', 'books/create');
	}
]);
'use strict';

//Setting up route
angular.module('books').config(['$stateProvider',
	function($stateProvider) {
		// Books state routing
		$stateProvider.
		state('listBooks', {
			url: '/books',
			templateUrl: 'modules/books/views/list-books.client.view.html'
		}).
		state('createBook', {
			url: '/books/create',
			templateUrl: 'modules/books/views/create-book.client.view.html'
		}).
		state('viewBook', {
			url: '/books/:bookId',
			templateUrl: 'modules/books/views/view-book.client.view.html'
		}).
		state('editBook', {
			url: '/books/:bookId/edit',
			templateUrl: 'modules/books/views/edit-book.client.view.html'
		});
	}
]);
'use strict';

// Books controller
angular.module('books').controller('BooksController', ['$scope', '$stateParams', '$location', '$modal', '$log', '$translate', 'Authentication', 'Shelves',
	function($scope, $stateParams, $location, $modal, $log, $translate, Authentication, Shelves) {
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
		$scope.remove = function(data) {
			data.shelf.$deleteBook({ 'bookId': data._id},
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

				// Get shelf for this book to check if it shelf hasnt changed
				Shelves.byBook({ bookId: data._id}).$promise.then(function(currentShelf) {
					if (shelf._id !== currentShelf[0]._id) {
						// Shelf has changed
						// Delete the book from the currentShelf
						var currentData = {};
						currentData = angular.copy(data);
						currentData.shelf = currentShelf[0];

						$scope.remove(currentData);

						// Create book in the shelf
						$scope.create(data);
					} else {
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
		      }
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
	      controller: ["$scope", "$modalInstance", "book", function($scope, $modalInstance, book) {
	      	Shelves.byBook({ bookId: book._id}, function(shelf) {
	      		$scope.formData = book;
						$scope.formData.shelf = shelf[0];
	      	});

	      	$scope.ok = function () {
				    if (this.form.editBookForm.$valid) {
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
	      }],
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
	      controller: ["$scope", "$modalInstance", "book", "shelf", function($scope, $modalInstance, book, shelf) {
	      	$scope.formData = book;
	      	$scope.formData.shelf = shelf;

	      	$scope.ok = function () {
				    $modalInstance.close($scope.formData);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      }],
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
	      controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
	      	$scope.formData = { };
	      	$scope.formData.fontColour = '#FFFFFF';
	      	$scope.formData.coverColour = '#000000';

	      	$scope.ok = function () {
	      		if (this.form.createBookForm.$valid) {
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
	      }],
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
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

// Core module config
angular.module('core').config(['$translateProvider',
	function($translateProvider) {
		$translateProvider.useStaticFilesLoader({
		  prefix: 'i18n/locale-',
		  suffix: '.json'
		});

		$translateProvider.preferredLanguage('en');
		// try to find out preferred language by yourself
		//$translateProvider.determinePreferredLanguage();

		// English as fallback language
		$translateProvider.fallbackLanguage('en');

		// Store choosen language in the cookies
		$translateProvider.useCookieStorage();
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$translate', 'Authentication', 'Menus',
	function($scope, $translate, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.changeLanguage = function(languageCode) {
			$translate.use(languageCode);
		};
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Shelves',
	function($scope, Authentication, Shelves) {
    var that = this;
		// This provides Authentication context.
		$scope.authentication = Authentication;

    Shelves.query().$promise.then(function(shelves) {
      $scope.shelves = shelves;

      $scope.flattenBooks = [];
      var booksIndex = 0;

      angular.forEach(shelves, function(shelf) {
        angular.forEach(shelf.books, function(book, i) {
          if (!shelf.default) {
            $scope.flattenBooks.push({
              title: book.title,
              author: book.author,
              isbn: book.isbn,
              fontColour: book.fontColour,
              coverColour: book.coverColour,
              pageCount: book.pageCount,
              sizeHeight: '25px',
              sizeWidth: randomIntFromInterval(110, 190) + 'px',
              publishedDate: book.publishedDate,
              description: book.description,
              shelf_name: shelf.name,
              book_end: false
            });

            // Insert book end
            if (shelf.books.length - 1 === i) {
              $scope.flattenBooks.push({
                book_end: true
              });
            }

            booksIndex++;
          }
        });
      });

      // Fallback
      if (booksIndex === 0) {
        $scope.flattenBooks.push({
          book_placeholder: true
        });
      }
    });

    var randomIntFromInterval = function(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    //TODO, order, sort, pagination
  }
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('shelves').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Shelves', 'shelves', 'dropdown', '/shelves(/create)?');
		Menus.addSubMenuItem('topbar', 'shelves', 'List Shelves', 'shelves');
		//Menus.addSubMenuItem('topbar', 'shelves', 'New Shelf', 'shelves/create');
	}
]);
'use strict';

//Setting up route
angular.module('shelves').config(['$stateProvider',
	function($stateProvider) {
		// Shelves state routing
		$stateProvider.
		state('listShelves', {
			url: '/shelves',
			templateUrl: 'modules/shelves/views/list-shelves.client.view.html'
		}).
		state('createShelf', {
			url: '/shelves/create',
			templateUrl: 'modules/shelves/views/create-shelf.client.view.html'
		}).
		state('viewShelf', {
			url: '/shelves/:shelfId',
			templateUrl: 'modules/shelves/views/view-shelf.client.view.html'
		}).
		state('editShelf', {
			url: '/shelves/:shelfId/edit',
			templateUrl: 'modules/shelves/views/edit-shelf.client.view.html'
		});
	}
]);
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
	      controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
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
	      }],
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
	      controller: ["$scope", "$modalInstance", "shelf", function($scope, $modalInstance, shelf) {
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
	      }],
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
	      controller: ["$scope", "$modalInstance", "shelf", function($scope, $modalInstance, shelf) {
	      	$scope.formData = shelf;

	      	$scope.ok = function () {
				    $modalInstance.close($scope.formData);
				  };

				  $scope.cancel = function () {
				    $modalInstance.dismiss('cancel');
				  };
	      }],
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
'use strict';

//Shelves service used to communicate Shelves REST endpoints
angular.module('shelves').factory('Shelves', ['$resource',
	function($resource) {
		return $resource('shelves/:shelfId', { shelfId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      default: {
        url: '/shelves/default',
        method: 'GET'
      },
      byBook: {
        url: '/shelves/book/:bookId',
        method: 'GET',
        isArray: true
      },
      createBook: {
        url: '/shelves/:shelfId/books',
        params: { shelfId: '@_id' },
        method: 'PUT'
      },
      updateBook: {
        url: '/shelves/:shelfId/books/:bookId',
        params: { shelfId: '@_id', bookId: '@bookId' },
        method: 'PUT'
      },
      deleteBook: {
        url: '/shelves/:shelfId/books/:bookId',
        params: { shelfId: '@_id', bookId: '@bookId' },
        method: 'DELETE'
      },
      readBooks: {
        url: '/shelves/books',
        method: 'GET',
        isArray: true
      },

		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);