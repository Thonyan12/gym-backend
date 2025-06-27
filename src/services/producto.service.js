const model = require("../models/producto.models");

exports.getAllProductos = async () => {
  return await model.findALL();
};
exports.getProductoById = async (id) => {
  const producto = await model.find(Number(id));
  if (!producto) {
    throw new Error(`Producto con id ${id} no encontrado`);
  }
  return producto;
};
