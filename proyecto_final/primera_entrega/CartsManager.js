const DEFAULT_PATH = './database/carts.json';
const { FileManager } = require('./FileManager');
const fm = new FileManager();
const { ProductManager } = require('./ProductManager');
const productManager = new ProductManager();

class CartsManager{
	
	_path = null;
	carts = [];

	// Constructor de clase
	constructor(path = DEFAULT_PATH){
		this._path = path;
	}

	// Agrega un producto al array
	addCart(productos){
		if (!Array.isArray(productos)) {
			return {status: false, message: "Productos: no tiene el formato correcto. Debe ser un array"};
		}

		if (!productos.length) {
			return {status: false, message: "Productos: el listado de productos está vacío. No se crea el carrito"};
		}

		// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
		let nuevoCarrito = {
			id: this._get_last_id() + 1,
			products: productos
		};
		
		this.carts.push(nuevoCarrito);
		
		return {status: fm.guardarArchivo(this._path, this.carts)};
	}

	addProductToCart(cartId, productId, quantity)
	{
		this.carts = fm.leerArchivo(this._path);

		// Valido el ID de carrito
		if (!this.existeCart(cartId)) return {status: false, message: `No existe el carrito con ID: ${cartId}`};
		
		// Valido el ID de producto
		if (!productManager.existeIdProducto(productId)) return {status: false, message: `No existe el product con ID: ${productId}`};

		// Valido la cantidad
		if (quantity <= 0) return {status: false, message: 'La cantidad de unidades a agregar debe ser mayor a cero'};

		let producto = productManager.getProductById(productId);

		// Valido es stock disponible
		if (producto.stock < quantity) return {status: false, message: `El producto ${productId} - ${producto.title} tiene solo ${producto.stock} unidades disponibes y usted quiere agregar ${quantity}`};

		for (let cart of this.carts) {
			// itero hasta encontrar el carrito buscado
			if (cart.id != cartId) continue;

			// Variable que me indica si debe sumarse a uno existente, o crearse un producto adicional al carrito
			let existeProductoEnCarrito = false;

			for (let producto of cart.products) {
				
				// Por cada producto que no coincida con el que estoy buscando, salto la iteración.
				if (producto.id != productId) continue;

				// Si llegó hasta este punto es porque se encontró con el producto que buscaba
				producto.quantity++;
				existeProductoEnCarrito = true;
				break;
			}

			// Si no se encontró el producto en el carrito, se lo agrega
			if (!existeProductoEnCarrito) {
				cart.products.push({id: parseInt(productId), quantity: quantity});
			}
			
			fm.guardarArchivo(this._path, this.carts);
			return {status: true};
		};

		return {status: false, message: 'Ocurrió un error al intentar agregar los productos al carrito'};
	}

	existeCart(cartId)
	{
		return (this.carts.find( cart => cart.id == cartId) !== undefined);
	}

	getCarts() {
		this.carts = fm.leerArchivo(this._path);
		
		if (this.carts !== false) {
			return {status: true, carts: this.carts};
		} else {
			return {status: false, message: 'No se pudo leer el archivo de carritos'};
		}

	}

	getCart(idCart) {
		this.carts = fm.leerArchivo(this._path);
		
		if (this.carts !== false) {
			let cart = this.carts.find( carrito => carrito.id == idCart);
			if (cart) {
				return {status: true, cart: cart};
			} else {
				return {status: false, message: `No se encontró el carrito con ID: ${idCart}`};
			}
		} else {
			return {status: false, message: 'No se pudo leer el archivo de carritos'};
		}

	}



	/**
	 * Si el array de carritos no está vacío, retorna el ID del último carrito
	 */
	_get_last_id() {
		let ultimoId = 0;

		if (!this.carts.length) return -1;

		return this.carts[this.carts.length - 1].id;
	}
	

}

module.exports.CartsManager = CartsManager;