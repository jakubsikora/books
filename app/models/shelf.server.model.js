'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Shelf Schema
 */
var ShelfSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Shelf name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Shelf', ShelfSchema);