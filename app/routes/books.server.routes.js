'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var books = require('../../app/controllers/books');

	// Books Routes
	app.route('/books')
		.get(books.list)
		.post(users.requiresLogin, books.create);

	app.route('/books/:bookId')
		.get(books.read)
		.put(users.requiresLogin, books.hasAuthorization, books.update)
		.delete(users.requiresLogin, books.hasAuthorization, books.delete);

	// Finish by binding the Book middleware
	app.param('bookId', books.bookByID);
};