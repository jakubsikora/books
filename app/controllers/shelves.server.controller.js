'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	errorHandler = require('./errors'),
	Shelf = mongoose.model('Shelf'),
	_ = require('lodash');

/******************** Shelfs ********************/
exports.postSignup = function(user, res) {
	var shelf = new Shelf({
		name: 'default',
		default: true
	});

	shelf.user = user;

	shelf.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});
};

/**
 * Create a Shelf
 */
exports.create = function(req, res) {
	var shelf = new Shelf(req.body);
	shelf.user = req.user;

	shelf.save(function(err) {
		console.log(err);
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

// TODO: update with books


/**
 * Update a Shelf
 */
exports.update = function(req, res) {
	var shelf = req.shelf;

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
	var shelf = req.shelf;

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
exports.list = function(req, res) { Shelf.find({ 'user': req.user._id }).sort('-created').populate('user', 'displayName').exec(function(err, shelves) {
		console.log(req.user._id);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelves);
		}
	});
};

exports.byBook = function(req, res) { Shelf.find({ books: { $elemMatch: { _id: req.params.bookId }}}).populate('user', 'displayName').exec(function(err, shelf) {
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
 * Shelf middleware
 */
exports.shelfByID = function(req, res, next, id) { Shelf.findById(id).populate('user', 'displayName').exec(function(err, shelf) {
		if (err) return next(err);
		if (! shelf) return next(new Error('Failed to load Shelf ' + id));
		req.shelf = shelf ;
		next();
	});
};

exports.default = function(req, res) { Shelf.findOne({ 'user': req.user._id, default: true }).populate('user', 'displayName').exec(function(err, shelf) {
		console.log(err);
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(shelf);
		}
	});
};

/******************** Books ********************/
exports.createBook = function(req, res) {
	var shelf = req.shelf;
	shelf.books.push(req.query);

	shelf.save(function(err) {
		if (err) {
			console.log('err', err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

exports.updateBook = function(req, res) {
	Shelf.update(
		{ _id: req.params.shelfId, 'books._id': req.params.bookId },
   	{ $set: {
   		'books.$.description': req.query.description,
   		'books.$.isbn': req.query.isbn,
   		'books.$.pageCount': req.query.pageCount,
   		'books.$.publishedDate': req.query.publishedDate,
   		'books.$.fontColour': req.query.fontColour,
   		'books.$.coverColour': req.query.coverColour,
   		'books.$.author': req.query.author,
   		'books.$.title': req.query.title
   		}
   	}
   	).exec(function(err, shelf) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

exports.deleteBook = function(req, res) {
	console.log(req.params);
	Shelf.update(
		{ _id: req.params.shelfId },
		{ $pull: { 'books': { '_id': req.params.bookId }}}).exec(function(err, shelf) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shelf);
		}
	});
};

// Read books
exports.readBooks = function(req, res) {
	var allBooks = [];
	Shelf.find({}, {'name': true, 'books': true}).sort('-created').populate('user', 'displayName').exec(function(err, shelves) {
		shelves.forEach(function(shelf) {
			shelf.books.forEach(function(book) {
				allBooks.push(book);
			});
		});

		res.jsonp(allBooks);
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