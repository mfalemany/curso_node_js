const express = require('express');
const app = express();
const PORT = 8080;
const { productsRouter } = require('./routers/productsRouter');
const { cartsRouter } = require('./routers/cartsRouter');

// Agrego los middlewares de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Defino los grupos de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('*', (req,res) => {
	res.send('Ups, no encontramos lo que buscas');
})

app.listen(PORT, () => console.log(`Escuchando en ${PORT}`));