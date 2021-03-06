const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-password');
	res.send(user);
});

router.post('/', auth, async (req, res) => {
	const { error } = validate(req.body);

	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });

	if (user) return res.status(400).send('User already exists.');

	user = await new User(_.pick(req.body, ['name', 'email', 'password']));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.delete('/:id', auth, async (req, res) => {
	let user = await User.find({ _id: req.params.id });
	if (!user) return res.status(404).send('User not found');

	users = await User.findByIdAndRemove(req.params.id);

	res.send(_user);
});

module.exports = router;
