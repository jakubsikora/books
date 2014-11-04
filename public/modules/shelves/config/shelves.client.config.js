'use strict';

// Configuring the Articles module
angular.module('shelves').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Shelves', 'shelves', 'dropdown', '/shelves(/create)?');
		Menus.addSubMenuItem('topbar', 'shelves', 'List Shelves', 'shelves');
		Menus.addSubMenuItem('topbar', 'shelves', 'New Shelf', 'shelves/create');
	}
]);