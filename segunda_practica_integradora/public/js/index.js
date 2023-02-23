const botones = document.querySelectorAll('.addToCart');
botones.forEach(boton => {
	boton.addEventListener('click', evento => {
		alert('Acá debería llamar (con fetch por ejemplo) a la API para agregar el producto ' + evento.target.id + ' al carrito (no se como mantener el ID del carrito sin sesiones ni cookies)');
	})
})
