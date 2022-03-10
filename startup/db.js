const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
	// Connecting To MongoDB
	mongoose.connect(config.get('db-connection-string')).then(() => winston.info('DB Connection Succesful'));
};
