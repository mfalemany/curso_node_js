const express        = require('express');
const sessionsRouter = express.Router();
const { userModel }  = require(__dirname + '/../dao/models/user.model'); 


sessionsRouter.post('/register', async (req, res) => {
	console.log('req.body', req.body);
	if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.age || !req.body.password) {
		res.status(400).send({success: false, message: 'No se recibieron los datos necesarios para registrar un usuario'});
		return;
	}

	const usuario = await userModel.findOne({email: req.body.email});
	if (usuario) {
		res.status(400).send({success: false, message: `Ya existe un usuario registrado con el email ${req.body.email}`});
		return;
	}
	const {first_name, last_name, age, email, password} = req.body;
	const user = {first_name, last_name, age, email, password};

	const resultado = await userModel.create(user);
	
	if (resultado._id) {
		res.send({success: true, createdUserId: resultado._id, message: 'Usuario creado con éxito'});
		return;
	} else {
		res.status(400).send({success: false, message: 'Ocurrió un error al intentar registrar el usuario'});
		return;
	}
});


module.exports.sessionsRouter = sessionsRouter;