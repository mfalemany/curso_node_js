const express           = require('express');
const viewsRouter       = express.Router();
const { productsModel } = require('../dao/models/products.model');
const { cartsModel }    = require('../dao/models/carts.model');


// Vista principal
viewsRouter.get('/products', async (req, res) => {
	console.log(req.query);
	const limit = req.query.limit || 10;
	const page  = req.query.page || 1;
	const sort  = req.query.sort ? {price: req.query.sort} : {};
	
	// Creo un objeto con las posibles variables de query
	const query     = construirQuery(req.query);
	const productos = await productsModel.paginate(query, {limit, page, sort, lean: true});
	
	res.render('productos/productos', {productos, limit});
});

/**
 * Se encarga de extraer todos los posibles filtros para un producto (precio, stock, titulo, descripción, etc.)
 * y arma un objeto que está listo para pasarse como filtro a una consulta a la BD
 *
 * @param {Object} query
 *
 * @return {Object}
 */
function construirQuery(query) {
	const posibleFilters = ['title', 'description', 'price', 'stock', 'category'];
	let appliedFilters = {};

	posibleFilters.forEach( filter => {
		if (query[filter]) {
			appliedFilters[filter] = {$regex: query[filter]};
		}
	});
	return appliedFilters;
}

module.exports.viewsRouter = viewsRouter;