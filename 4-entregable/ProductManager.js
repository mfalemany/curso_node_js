const fs = require('fs');

class ProductManager {

	static currentId = 0;
	_path = null;
	productos = [];


	// Constructor de clase
	constructor(path){
		this._setPath(path);
	}

	_setPath(path){
		this._path = path;
	}

	// Retorna el ID interno que maneja la clase, y luego lo incrementa
	static getCurrentId(){
		return ProductManager.currentId++;
	}

	// Agrega un producto al array
	addProduct(producto){
		if (!producto) return false;

		if (this.existeProducto(producto)) throw `El producto que intenta agregar ya existe (${producto.title})`;
		
		// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
		producto.id = ProductManager.getCurrentId();
		
		this.productos.push(producto);
		
		this.guardarArchivo();
	}

	addProducts(productos){
		productos.forEach( producto => this.addProduct(producto));
	}

	// Determina si un producto existe actualmente en el array "productos" (el criterio es el campo "code")
	existeProducto(producto){
		return (this.productos.find( actual => producto.code == actual.code) !== undefined)
	}

	// Retorna todos los productos actuales en el array "productos"
	getProducts(){
		this.leerArchivo()
		return this.productos;
	}

	// Busca y retorna un producto por su ID interno
	getProductById(id){
		// Acá no se lee directamente el archivo porque getPRoducts lo va a hacer
		let producto = this.productos.find( actual => id == actual.id);	
		
		if (producto !== undefined) return producto;

		throw 'El producto con ID ' + id + ' no existe entre los disponibles';
	}

	setProducts(productos){
		this.productos = productos;
	}

	updateProduct(idProducto, data){
		this.leerArchivo()

		// Evito que al mezclar los objetos, me pise el ID original
		delete data.id;

		for (let indice in this.productos) {
			if (this.productos[indice].id == idProducto) {
				// Mezclo (actualizo) los datos del objeto, con los recibidos
				let productoActualizado = {...this.productos[indice], ...data};
				this.productos[indice] = productoActualizado;
				break;
			}
		}
		this.guardarArchivo();
	}

	deleteProduct(idProducto){
		this.leerArchivo()

		for (let indice in this.productos) {
			if (this.productos[indice].id == idProducto) {
				delete this.productos[indice];
				break;
			}
		}
		this.guardarArchivo();
	}

	/**
	 * Lee el contenido del archivo y lo asigna a this.productos (crea el archivo si no existe)
	 */
	leerArchivo(){
		const data = fs.readFileSync(this._path, {encoding: 'utf8', flag: 'w+'})

		if (data.length) {
			this.setProducts(JSON.parse(data));
		}
	}

	guardarArchivo(){
		if (this.productos.length) {
			fs.writeFileSync(this._path, JSON.stringify(this.productos))
		}
	}
}