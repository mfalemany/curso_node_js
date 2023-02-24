const express           = require("express");
const productsRouter    = express.Router(); 
const { productsModel } = require('../dao/models/products.model');
const mongoose          = require('mongoose');


productsRouter.get('/', async (req, res) => {
	const limit = req.limit || 10;
	const page  = req.page  || 1;
	const sort  = req.sort ? {price: req.query.sort} : {};
	
	try{
		const productos = await productsModel.paginate({}, {lean: true, sort, page, limit});
		res.send({
			success: true, 
			payload: productos.docs, 
			totalPages: productos.totalPages,
			prevPage: productos.prevPage, 
			nextPage: productos.nextPage, 
			page: productos.page, 
			hasPrevPage: productos.hasPrevPage, 
			hasNextPage: productos.hasNextPage, 
			prevLink: '', 
			nextLink: ''
		});
	} catch(error) {
		res.send({success: false, message: error});
	}
});

productsRouter.post('/', async (req, res) => {
	let { title, description, code, price, status, stock, category, thumbnails } = req.body.producto;

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