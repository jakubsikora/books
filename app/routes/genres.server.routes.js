'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var genres = require('../../app/controllers/genres');

	// Genres Routes
	app.route('/genres')
		.get(genres.list)
		.post(users.requiresLogin, genres.create);

	app.route('/genres/:genreId')
		.get(genres.read)
		.put(users.requiresLogin, genres.hasAuthorization, genres.update)
		.delete(users.requiresLogin, genres.hasAuthorization, genres.delete);

	// Finish by binding the Genre middleware
	app.param('genreId', genres.genreByID);
};