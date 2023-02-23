const mongoose = require('mongoose');

const messagesCollection = 'messages';
const messagesSchema     = new mongoose.Schema({
	from: String,
	to: String,
	content: String,
	datetime: String
});

module.exports.messagesModel = mongoose.model(messagesCollection, messagesSchema);