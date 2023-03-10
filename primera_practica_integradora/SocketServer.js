const { Server }         = require('socket.io');
const { ProductManager } = require('./dao/ProductManager');

/* Administrador de productos */
const productManager = new ProductManager();

/* Creo un servidor de Sockets sobre httpServer */
const socketServer = new Server();
socketServer.on('connection', socket => {
	
	// Loggeo la conexión (solo a fines de verificar que todo está OK)
	console.log('Cliente conectado. ID: ' + socket.id);

	// Uso el productManager para obtener el listado de los productos actuales, y se los envío al cliente recién conectado
	// (Esto quiere decir que a cada cliente que se conecta, le mando la lista de productos que tengo hasta el momento)
	const productosActuales = productManager.getProducts();
	
	console.log('Emitiendo datos iniciales');
	socket.emit('cargaInicial', productosActuales );

	// Con esto, escucho el evento "altaProducto" de cada cliente. Cuando un cliente agrega un producto, lo guardo (usando el productManager)
	// y emito un nuevo mensaje a través del socket para avisar a todos del nuevo producto
	socket.on('altaProducto', data => {
		
		// Estos campos son obligatorios para el productManager, pero no se reciben desde el cliente (para ahorrar tiempo nomás)
		const camposFaltantes = {status: true, stock: 10, category: "sin definir", thumbnails: [] };
		
		// Se mezclan los datos recibidos desde el cliente, con el objeto que creé en la linea anterior
		productoCompleto = {...data.producto, ...camposFaltantes};

		try{
			// Agrego el producto al archivo
			const guardado = productManager.addProduct(productoCompleto);
			
			// Si todo salió bien, aviso a todos los clientes, para que lo agreguen a su tabla
			if (guardado.status) {
				socketServer.emit('nuevoProducto', productoCompleto );
			}
		} catch (error) {
			console.log('Ocurrió un error: ', error);
		}
		
	})
});

module.exports = {
	socketServer
}
