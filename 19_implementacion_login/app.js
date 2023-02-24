const express            = require('express');
const app                = express();
const handlebars         = require('express-handlebars');
const { viewsRouter }    = require('./routers/viewsRouter');
const { userRouter }     = require('./routers/userRouter');
const { productsRouter } = require('./routers/productsRouter');
const { cartsRouter }    = require('./routers/cartsRouter');
const { sessionsRouter } = require('./routers/sessionsRouter');
const cookieParser       = require('cookie-parser');
const session            = require('express-session');
/*const FileStore        = require('session-file-store');*/
const MongoStore         = require('connect-mongo'); 
const PORT               = 8080;

/* Obtengo una instancia del server de Express*/
const httpServer = app.listen(PORT, () => console.log(`Escuchando en ${PORT}`));

// Genero un almacenamiento para las sesiones
/*const fileStorage = new FileStore(session);*/

// Agrego los middlewares de express y cookie-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('SecretoDeEstado'));
app.use(session({
	store: MongoStore.create({
		mongoUrl: 'mongodb+srv://mfalemany:Coderhouse@codercluster.kkhxljt.mongodb.net/ecommerce?retryWrites=true&w=majority',
		mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
		ttl: 120 /* Tiempo que dura la sesión, en segundos */
	}),
	secret: 'FormulaCocaCola',
	resave: true,
	saveUninitialized: true
}));

/* Handlebars */
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

/* Contenido estático */
app.use(express.static(__dirname + '/public'));

/* Gestor de rutas/vistas */
app.use('/', viewsRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);

/* Por si las moscas */
app.get('*', (req,res) => {
	res.send('Ups, no encontramos lo que buscas');
})