const express           = require("express");
const productsRouter    = express.Router(); 
const { productsModel } = require('../dao/models/products.model');
const mongoose          = require('mongoose');


productsRouter.get('/', async (req, res) => {
	try{
		let products = await productsModel.find();
		res.send({success: true, payload: products});
	} catch(error) {
		res.send({success: false});
	}
});

productsRouter.post('/', async (req, res) => {
	let { title, description, code, price, status, stock, category, thumbnails } = req.body.producto;
	console.log(req.body);
	if (!title || !description || !code || !price) {
		res.send({success: false, payload: "No se enviaron todos los campos obligatorios"});
	}
	try {
		let result = await productsModel.create({
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbnails 
		});
		
		res.send({success: true, payload: result});
	
	} catch(error) {
		res.send({success: false, payload: "Ocurrió un error: " + error});
	}

});


// La consola tira una DeprecationWarning y sugiere agregar esta línea
mongoose.set('strictQuery', false);

// Conecto con db mongo en Atlas
mongoose.connect('mongodb+srv://mfalemany:Coderhouse@codercluster.kkhxljt.mongodb.net/ecommerce?retryWrites=true&w=majority', (error) => {
	if (error) {
		console.log('Ups, ocurrió un error', error);
	}
});

module.exports.productsRouter = productsRouter;