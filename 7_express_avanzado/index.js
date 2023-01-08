const express = require("express");
const app = express();

// Backend de la pareja Gabriel
let compras = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Metodos: GET, POST, PUT, DELETE
app.get("/menu", (req, res) => {
  res.send("Milanesa napolitana");
});
app.post("/compras", (req, res) => {
  const _compras = req.body;
  if (_compras.length) {
    compras = _compras;
    return res.send("ok");
  }
  res.status(400).send("Bad request");
});
app.get("/compras", (req, res) => {
  res.send(compras);
});
app.put("/compras/:id", (req, res) => {
  let productoActual = compras.find( prod => prod.id == req.params.id );
  productoActual.producto = req.body.producto;
  res.send(compras);
});

app.delete("/compras/:id", (req, res) => {
    let indiceBorrar = compras.findIndex( prod => prod.id == req.params.id );
    compras.splice(indiceBorrar, 1);
    res.send(compras);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
