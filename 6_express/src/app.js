const express = require('express');
const pm = require('./ProductManager');

const app = express();
app.use(express.urlencoded({extended: true}));

app.get('/products', (req, res) => {
	let productManager = new pm.ProductManager('productos.json');
	let productos = productManager.getProducts();

	// Si existe límite recibido en 
	if (req.query.limit && !isNaN(req.query.limit)) {
		productos = productos.slice(0, req.query.limit);
	}

	res.send(productos);
})

app.get('/products/:pid', (req, res) => {
	let productManager = new pm.ProductManager('productos.json');
	let producto = productManager.getProductById(req.params.pid);

	res.send(producto);
})


app.listen(8080, () => console.log('Escuchando en el puerto 8080'));