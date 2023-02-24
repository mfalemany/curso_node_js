const mongoose = require('mongoose');

const userCollection = 'user';
const userSchema     = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
	},
	age: Number,
	password: String
});

module.exports.userModel = mongoose.model(userCollection, userSchema);