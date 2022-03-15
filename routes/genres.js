const express = require('express');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();
const { validate, Genre } = require('../models/genre');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
	const genre = await Genre.find().sort('name');
	if (!genre) return res.status(404).send('Genres not found.');
	res.send(genre);
});

router.get('/:id', validateObjectId, async (req, res) => {
	const genre = await Genre.findById(req.params.id);

	if (!genre) return res.status(404).send('Genre with specified ID not found');

	res.send(genre);
});

router.post('/', auth, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const genre = new Genre({
		name: req.body.name,
	});

	await genre.save();

	res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

	if (!genre) return res.status(404).send('Invalid genre. PUT request failed.');

	res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	const genre = await Genre.findByIdAndRemove(req.params.id);

	if (!genre) return res.status(404).send('Genre not found. DELETE request failed.');

	res.send(genre);
});

module.exports = router;
