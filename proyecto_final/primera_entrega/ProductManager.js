const DEFAULT_PATH = './database/products.json';
const { FileManager } = require('./FileManager');
const fm = new FileManager();

class ProductManager {

	_path = null;
	productos = [];


	// Constructor de clase
	constructor(path = DEFAULT_PATH){
		this._setPath(path);
	}

	_setPath(path){
		this._path = path;
	}

	// Agrega un producto al array
	addProduct(producto){
		if (!producto) return false;

		let esProductoCompleto = this._validarCamposObligatorios(producto);

		if (!esProductoCompleto.status) {
			return esProductoCompleto;
		}

		if (this.existeProducto(producto)) throw `El producto que intenta agregar ya existe (${producto.title})`;
		
		// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
		producto.id = this._get_last_id() + 1;
		
		this.productos.push(producto);
		
		return {status: fm.guardarArchivo(this._path, this.productos)};
	}

	addProducts(productos){
		productos.forEach( producto => this.addProduct(producto));
		return {status: true}
	}

	// Determina si un producto existe actualmente en el array "productos" (el criterio es el campo "code")
	existeProducto(producto){
		if (!this.productos.length) {
			this.productos = fm.leerArchivo(this._path);
		}
		
		return (this.productos.find( actual => producto.code == actual.code) !== undefined)
	}

	// Determina si un producto existe actualmente en el array "productos" (el criterio es el campo "code")
	existeIdProducto(idProducto){
		if (!this.productos.length) {
			this.productos = fm.leerArchivo(this._path);
		}
		return (this.productos.find( actual => actual.id == idProducto) !== undefined);
	}

	// Retorna todos los productos actuales en el array "productos"
	getProducts(){
		this.productos = fm.leerArchivo(this._path);
		return this.productos;
	}

	// Busca y retorna un producto por su ID interno
	getProductById(id){
		// Acá no se lee directamente el archivo porque getPRoducts lo va a hacer
		let producto = this.productos.find( actual => id == actual.id);	
		
		if (producto !== undefined) return producto;

		return {status: false, message: 'El producto con ID ' + id + ' no existe entre los disponibles'};
	}

	setProducts(productos){
		this.productos = productos;
	}

	updateProduct(idProducto, data){
		this.productos = fm.leerArchivo(this._path);

		// Evito que al mezclar los objetos, me pise el ID original
		delete data.id;

		if (!this.existeIdProducto(idProducto)) {
			return {status: false, message: 'No se encontró el producto que busca'};
		}

		for (let indice in this.productos) {
			if (this.productos[indice].id == idProducto) {
				// Mezclo (actualizo) los datos del objeto, con los recibidos
				let productoActualizado = {...this.productos[indice], ...data};
				this.productos[indice] = productoActualizado;
				break;
			}
		}

		return {status: fm.guardarArchivo(this._path, this.productos)};
	}

	deleteProduct(idProducto){
		this.productos = fm.leerArchivo(this._path);
		
		if (!this.existeIdProducto(idProducto)) {
			return {status: false, message: 'No se encontró el producto que busca'};
		}
		
		// Conservo todos los productos excepto el que coincida con el ID a eliminar
		this.productos = this.productos.filter( producto => producto.id != idProducto);
		return {status: fm.guardarArchivo(this._path, this.productos)};
	}

	_validarCamposObligatorios(producto) {
		// Valido que todos los campos obligatorios estén presentes
		const camposObligatorios = ['title', 'description', 'code', 'price', 'status', 'stock', 'category'];
		for (let i = 0; i < camposObligatorios.length; i++) {
			if (producto[camposObligatorios[i]] == undefined) {
				return  {status: false, message: `Falta el campo obligatorio ${camposObligatorios[i]}`};
			}
		}

		return {status: true};
	}

	/**
	 * Si el array de productos no está vacío, retorna el ID del último producto 
	 */
	_get_last_id() {
		let ultimoId = 0;

		if (!this.productos.length) return -1;

		return this.productos[this.productos.length - 1].id;
	}
}

module.exports.ProductManager = ProductManager;