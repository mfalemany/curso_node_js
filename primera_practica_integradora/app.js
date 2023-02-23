const express            = require('express');
const app                = express();
const handlebars         = require('express-handlebars');
const { socketServer }   = require('./SocketServer');
const { viewsRouter }    = require('./routers/viewsRouter');
const { userRouter }     = require('./routers/userRouter');
const { productsRouter } = require('./routers/productsRouter');
const { messagesRouter } = require('./routers/messagesRouter');
const PORT               = 8080;

/* Obtengo una instancia del server de Express*/
const httpServer = app.listen(PORT, () => console.log(`Escuchando en ${PORT}`));

// Agrego los middlewares de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Creo un servidor de Sockets sobre httpServer */
socketServer.attach(httpServer);

/* Handlebars */
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

/* Contenido estático */
app.use(express.static(__dirname + '/public'));

/* Gestor de rutas/vistas */
app.use('/api/', viewsRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/messages', messagesRouter);

/* Por si las moscas */
app.get('*', (req,res) => {
	res.send('Ups, no encontramos lo que buscas');
})