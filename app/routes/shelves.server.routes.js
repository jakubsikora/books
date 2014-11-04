'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var shelves = require('../../app/controllers/shelves');

	// Shelves Routes
	app.route('/shelves')
		.get(shelves.list)
		.post(users.requiresLogin, shelves.create);

	app.route('/shelves/:shelfId')
		.get(shelves.read)
		.put(users.requiresLogin, shelves.hasAuthorization, shelves.update)
		.delete(users.requiresLogin, shelves.hasAuthorization, shelves.delete);

	// Finish by binding the Shelf middleware
	app.param('shelfId', shelves.shelfByID);
};