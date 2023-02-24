const mongoose         = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productsCollection = 'products';
const productsSchema     = new mongoose.Schema({
	title: String,
	description: String,
	code: {
		type: String,
		unique: true,
	},
	price: {
		type: Number,
		min: 0,
	},
	status: String,
	stock: {
		type: Number,
		min: 0,
	},
	category: String,
	thumbnails: Array
});

// Agrego el plugin de paginación
productsSchema.plugin(mongoosePaginate);
module.exports.productsModel = mongoose.model(productsCollection, productsSchema);