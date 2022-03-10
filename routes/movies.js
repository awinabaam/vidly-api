const express = require('express');
const auth = require('../middleware/auth');
const { Genre } = require('../models/genre');
const genre = require('../models/genre');

const router = express.Router();
const { validate, Movie } = require('../models/movie');

router.get('/', async (req, res) => {
	const movie = await Movie.find().sort('name');
	res.send(movie);
});

router.get('/:id', async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	if (!movie) return res.status(404).send('Genre not found');

	res.send(movie);
});

router.post('/', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findById(req.body.genreId);
	if (!genre) return res.status(400).send('Invalid Genre.');

	const movie = new Movie({
		title: req.body.title,
		genre: {
			_id: genre._id,
			name: genre.name,
		},
		numberInStock: req.body.numberInStock,
		dailyRentalRate: req.body.dailyRentalRate,
	});

	await movie.save();

	res.send(movie);
});

router.put('/:id', auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	const movie = await Movie.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			genre: {
				_id: req.body.genre._id,
				name: req.body.genre.name,
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate,
		},
		{ new: true }
	);

	if (!movie) return res.status(404).send('Invalid movie. PUT request failed.');

	res.send(movie);
});

router.delete('/:id', auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	const movie = await Movie.findByIdAndRemove(req.params.id);

	if (!movie) return res.status(404).send('Genre not found. DELETE request failed.');

	res.send(movie);
});

module.exports = router;
