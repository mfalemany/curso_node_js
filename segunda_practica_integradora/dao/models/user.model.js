const mongoose = require('mongoose');

const userCollection = 'usuarios';
const userSchema     = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
	}
});

module.exports.userModel = mongoose.model(userCollection, userSchema);