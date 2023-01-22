let listaInicialCargada = false;
const socket = io();
socket.emit('mensaje');

/* Escuchando el agregado de productos */
socket.on('cargaInicial', listaProductos => {
	// Esto se hace porque si corremos la app con nodemon, cuando detecta cambios en productos.json, levanta nuevamente el server
	// y vuelve a enviar los datos iniciales
	if (!listaInicialCargada) {
		agregarProductos(listaProductos);

		// Establezco a true (para evitar que se vuelva a cargar por nodemon)
		listaInicialCargada = true;
	}
});

socket.on('nuevoProducto', producto => {
	agregarProducto(producto);

})



/* Guardado de un nuevo producto */
$botonSubmit = document.getElementById('btn_guardar_producto');

$botonSubmit.addEventListener('click', event => {
	event.preventDefault();

	let producto = {
		title: document.getElementById('title').value,
		description: document.getElementById('description').value,
		code: document.getElementById('code').value,
		price: document.getElementById('price').value,
	};

	// Aviso al servidor que hay un nuevo producto
	socket.emit('altaProducto', { producto });

	// Limpio el form
	document.getElementById('alta_producto').reset();
})


// Función que recorre un arreglo de productos y los va agregando uno a uno a la tabla
function agregarProductos(listaProductos) {
	listaProductos.forEach( producto => {
		agregarProducto(producto);
	});
}

// Función que agrega un solo producto a la tabla
function agregarProducto(producto) {
	let fila        = document.createElement('tr');
	
	let title       = document.createElement('td');
	title.innerHTML = producto.title;
	
	let description       = document.createElement('td');
	description.innerHTML = producto.description;

	let code        = document.createElement('td');
	code.innerHTML  = producto.code;
	
	let price       = document.createElement('td');
	price.innerHTML = producto.price;

	fila.appendChild(title);
	fila.appendChild(description);
	fila.appendChild(code);
	fila.appendChild(price);

	document.getElementById('productosActuales').appendChild(fila);

}
