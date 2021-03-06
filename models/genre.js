const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
});

const Genre = mongoose.model('genres', genreSchema);

function validateGenre(genre) {
	const schema = {
		// id: Joi.number().required(),
		name: Joi.string().min(5).max(50).required(),
	};

	return Joi.validate(genre, schema);
}

module.exports = {
	validate: validateGenre,
	Genre,
	genreSchema,
};
