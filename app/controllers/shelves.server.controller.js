'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Shelf = mongoose.model('Shelf'),
	_ = require('lodash');

/**
 * Create a Shelf
 */
exports.create = function(req, res) {
	var shelf = new Shelf(req.body);
	shelf.user = req.user;

	shelf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

/**
 * Show the current Shelf
 */
exports.read = function(req, res) {
	res.jsonp(req.shelf);
};

/**
 * Update a Shelf
 */
exports.update = function(req, res) {
	var shelf = req.shelf ;

	shelf = _.extend(shelf , req.body);

	shelf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

/**
 * Delete an Shelf
 */
exports.delete = function(req, res) {
	var shelf = req.shelf ;

	shelf.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

/**
 * List of Shelves
 */
exports.list = function(req, res) { Shelf.find().sort('-created').populate('user', 'displayName').exec(function(err, shelves) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelves);
		}
	});
};

/**
 * Shelf middleware
 */
exports.shelfByID = function(req, res, next, id) { Shelf.findById(id).populate('user', 'displayName').exec(function(err, shelf) {
		if (err) return next(err);
		if (! shelf) return next(new Error('Failed to load Shelf ' + id));
		req.shelf = shelf ;
		next();
	});
};

exports.shelfByBookTitle = function(req, res) { Shelf.find({ books: { $elemMatch: { title: req.params.title }}}).populate('user', 'displayName').exec(function(err, shelf) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

/**
 * Shelf authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.shelf.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};