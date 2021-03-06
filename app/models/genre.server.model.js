'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Genre Schema
 */
var GenreSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill the genre name',
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

mongoose.model('Genre', GenreSchema);