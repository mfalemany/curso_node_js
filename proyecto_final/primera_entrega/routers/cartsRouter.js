const express = require('express');
const cartsRouter = express.Router();
const { CartsManager } = require('../CartsManager');
const cartsManager = new CartsManager();

cartsRouter.post('/', (req, res) => {
	if (!req.body.productos) {
		res.status(400).send('No se recibieron los productos que se deben incluír en el carrito');
	}

	let guardado = cartsManager.addCart(req.body.productos);

	if (guardado.status) {
		res.send('Carrito guardado con éxito');
	} else {
		res.status(400).send(guardado.message);
	}
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
	if (!req.params.cid) {
		res.status(400).send('No se recibió el parámetro CartID');
	}
	if (isNaN(req.params.cid)) {
		res.status(400).send('El parámetro CartID debe ser numérico');
	}
	if (!req.params.pid) {
		res.status(400).send('No se recibió el parámetro ProductID');
	}
	if (isNaN(req.params.pid)) {
		res.status(400).send('El parámetro ProductID debe ser numérico');
	}

	let resultado = cartsManager.addProductToCart(req.params.cid, req.params.pid, 1);

	if (resultado.status) {
		res.send('Producto agregado al carrito con éxito');
	} else {
		res.status(400).send(resultado.message);
	}

});

cartsRouter.get('/', (req, res) => {
	let resultado = cartsManager.getCarts();

	if (resultado.status) {
		res.send(resultado.carts);
	} else {
		res.status(400).send(resultado.message);
	}
});

cartsRouter.get('/:id', (req, res) => {
	if (!req.params.id) {
		return {status: false, message: 'No se recibió un ID de carrito'}
	}

	let resultado = cartsManager.getCart(req.params.id);

	if (resultado.status) {
		res.send(resultado.cart.products);
	} else {
		res.status(404).send(resultado.message);
	}
});


module.exports.cartsRouter = cartsRouter;