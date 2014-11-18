'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var BookSchema = new Schema({
	isbn: {
		type: Number,
		required: 'Please fill the book ISBN (no hyphens)',
		trim: true
	},
	title: {
		type: String,
		default: '',
		required: 'Please fill the book title',
		trim: true
	},
	author: {
		type: String,
		default: '',
		required: 'Please fill the book author',
		trim: true
	},
	publishedDate: {
		type: Number,
		required: 'Please fill the book publish date',
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	pageCount: {
		type: Number,
		trim: true
	},
	thumbnail: {
		type: String,
		trim: true
	},
	coverColour: {
		type: String,
		default: '#000000',
		trim: true
	},
	fontColour: {
		type: String,
		default: '#FFFFFF',
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
	default: {
		type: Boolean,
		default: false
	},
	books: [BookSchema],
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