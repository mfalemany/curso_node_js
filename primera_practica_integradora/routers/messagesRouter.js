const express           = require("express");
const messagesRouter    = express.Router(); 
const { messagesModel } = require('../dao/models/messages.model');
const mongoose          = require('mongoose');


messagesRouter.get('/', async (req, res) => {
	try{
		let messages = await messagesModel.find();
		res.send({success: true, payload: messages});
	} catch(error) {
		res.send({success: false});
	}
});

messagesRouter.post('/', async (req, res) => {
	let { from, to, content } = req.body.message;
	
	if (!from || !content) {
		res.status(400).send({success: false, payload: "No se enviaron todos los campos obligatorios"});
		return;
	}
	try {
		let result = await messagesModel.create({
			from,
			to,
			content,
			datetime: new Date().toTimeString()
		});
		
		res.send({success: true, payload: result});
	
	} catch(error) {
		res.status(400).send({success: false, payload: "Ocurrió un error: " + error});
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

module.exports.messagesRouter = messagesRouter;
