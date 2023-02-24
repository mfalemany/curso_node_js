/* ========= Register de usuarios ========= */
$boton = document.getElementById('user-register');
$boton.addEventListener('click', async (event) => {
	alert('click');
	event.preventDefault();

	const formData = getFormData(['first_name', 'last_name', 'email', 'age', 'password']);
	
	const resultado = await doFetch('http://localhost:8080/api/sessions/register', 'post', false, formData);
	const clase = resultado.success ? 'info' : 'error';
	setMensajeGlobal(resultado.message, clase);
	
});

const getFormData = campos => {
	const formData = {};
	
	campos.forEach(campo => {
		formData[campo] = document.getElementById(campo).value;
	})

	return formData;
}

const doFetch = async (url, method, headers, body) => {
	method = method || 'get';
	headers = {'Content-Type': 'application/json'};
	body = body ? JSON.stringify(body) : {};
	console.log(body);

	return await fetch(url, {method, headers, body}).then( r => r.json()).then( j => j);
}

const setMensajeGlobal = (mensaje, clase) => {
	$mensaje = document.getElementById('mensaje');
	$mensaje.style.visibility = 'visible';
	//Limpio todas las clases anteriores
	$mensaje.classList.remove(...$mensaje.classList);

	// Agrego la que corresponde
	$mensaje.classList.add(clase);

	$mensaje.innerHTML = mensaje;

	setTimeout(() => {
		$mensaje.style.visibility = 'hidden';		
	},4000);
}