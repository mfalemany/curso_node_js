const express            = require('express');
const app                = express();
const productsRouter     = express.Router();
const { ProductManager } = require('../ProductManager');
const productManager     = new ProductManager();

productsRouter.get('/', (req, res) => {
	let productos = productManager.getProducts();

	// Si no hay productos, retorno el array vacío
	if (!productos.length) {
		res.send([]);
	}

	// Si hay productos, analizo el límite solicitado por la request
	if (req.query.limit && !isNaN(req.query.limit)) {
		productos = productos.slice(0, req.query.limit);
	}

	res.send(productos);
});

productsRouter.get('/:id', (req, res) => {
	// El identificador debe ser numérico
	if (isNaN(req.params.id)) {
		res.status(400).send('El identificador de producto debe ser numérico');
	}

	// Obtengo todos los productos del manager
	let productos = productManager.getProducts();

	// Si no hay productos en la colección, directamente no buscamos
	if (!productos.length) {
		res.status(404).send(`El producto ${req.params.id} no existe`);
	}

	// Busco el producto indicado
	let productoBuscado = productos.find( producto => producto.id == req.params.id);

	if (!productoBuscado) {
		res.status(404).send(`El producto ${req.params.id} no existe`);
	}

	res.send(productoBuscado);
	
});

productsRouter.post('/', (req, res) => {
	let producto = req.body.producto;
	let response = productManager.addProduct(producto);
	
	if (response.status) {
		res.send('Producto agregado con éxito!');
	} else {
		res.status('400').send(`Algo salió mal: ${response.message}`);
	}
});

productsRouter.put('/:id', (req, res) => {
	if (!req.params.id) {
		res.status(400).send('No se recibió un ID de producto para actualizar');
	}

	if (!req.body) {
		res.status(400).send('No se recibió el cuerpo de la petición');
	}

	if (isNaN(req.params.id)) {
		res.status(400).send('El ID de producto debe ser numérico');
	}

	let actualizacion = productManager.updateProduct(req.params.id, req.body);

	if (actualizacion.status) {
		res.send('Producto actualizado con éxito!');
	} else {
		res.status(404).send(actualizacion.message);
	}
});

productsRouter.delete('/:id', (req, res) => {
	if (!req.params.id) {
		res.status(400).send('No se recibió un ID de producto para actualizar');
	}

	if (isNaN(req.params.id)) {
		res.status(400).send('El ID de producto debe ser numérico');
	}

	let eliminacion = productManager.deleteProduct(req.params.id);

	if (eliminacion.status) {
		res.send('Producto eliminado con éxito!');
	} else {
		res.status(404).send(eliminacion.message);
	}
});

/**
 * Este endpoint fue creado solo para poblar de productos el archivo productos.json
 */
productsRouter.post('/multiples', (req, res) => {
	let productos = req.body.productos;
	let response = productManager.addProducts(productos);
	
	if (response.status) {
		res.send('Producto agregado con éxito!');
	} else {
		res.status('400').send(`Algo salió mal: ${response.message}`);
	}
});

module.exports.productsRouter = productsRouter;