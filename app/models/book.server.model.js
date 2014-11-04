'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var Shelf = require('./shelf.server.model');

/**
 * Book Schema
 */
var BookSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Book name',
		trim: true
	},
	shelf: Shelf,
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Book', BookSchema);