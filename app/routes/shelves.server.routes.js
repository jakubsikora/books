'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var shelves = require('../../app/controllers/shelves');

	// Shelves Routes
	app.route('/shelves')
		.get(users.requiresLogin, shelves.list)
		.post(users.requiresLogin, shelves.create);

	app.route('/shelves/default')
		.get(users.requiresLogin, shelves.default);

	app.route('/shelves/books')
		.get(users.requiresLogin, shelves.readBooks);

	app.route('/shelves/:shelfId/books')
		.put(users.requiresLogin, shelves.hasAuthorization, shelves.createBook);

	app.route('/shelves/:shelfId/books/:bookId')
		.put(users.requiresLogin, shelves.hasAuthorization, shelves.updateBook)
		.delete(users.requiresLogin, shelves.hasAuthorization, shelves.deleteBook);

	app.route('/shelves/:shelfId')
		.get(shelves.read)
		.put(users.requiresLogin, shelves.hasAuthorization, shelves.update)
		.delete(users.requiresLogin, shelves.hasAuthorization, shelves.delete);

	// app.route('/shelves/:shelfId/books')
	// 	.post(shelves.createBook);

	app.route('/shelves/book/:bookId').get(shelves.byBook);
	// Finish by binding the Shelf middleware
	app.param('shelfId', shelves.shelfByID);
};