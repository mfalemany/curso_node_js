const express            = require('express');
const viewsRouter        = express.Router();
const { ProductManager } = require('../dao/ProductManager');

/* Administrador de productos */
const productManager = new ProductManager();

// Vista principal
viewsRouter.get('/', (req, res) => {
	const productosActuales = productManager.getProducts();
	res.render('home', {productosActuales});
});

// Vista con socket
viewsRouter.get('/realtimeproducts', (req, res) => {
	res.render('realTimeProducts');
});


module.exports.viewsRouter = viewsRouter;