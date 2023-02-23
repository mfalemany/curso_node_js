const express       = require("express");
const userRouter    = express.Router(); 
const { userModel } = require('../dao/models/user.model');
const mongoose      = require('mongoose');


userRouter.get('/', async (req, res) => {
	try{
		let users = await userModel.find();
		res.send({success: true, payload: users});
	} catch(error) {
		res.send({success: false});
	}
});

userRouter.post('/', async (req, res) => {
	let {first_name, last_name, email} = req.body;

	if (!first_name || !last_name || !email) {
		res.send({success: false, payload: "No se enviaron todos los campos obligatorios"});
	}

	let result = userModel.create({
		first_name,
		last_name,
		email
	});

	res.send({success: true, payload: result});
});


// La consola tira una DeprecationWarning y sugiere agregar esta línea
mongoose.set('strictQuery', false);

// Conecto con db mongo en Atlas
mongoose.connect('mongodb+srv://mfalemany:Coderhouse@codercluster.kkhxljt.mongodb.net/ecommerce?retryWrites=true&w=majority', (error) => {
	if (error) {
		console.log('Ups, ocurrió un error', error);
	}
});

module.exports.userRouter = userRouter;
