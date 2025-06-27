const service = require("../services/producto.service");

exports.getAllProductos = async (req, res) => {
  try {
    const productos = await service.getAllProductos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};
exports.getProductoById = async (req, res) => {
  try {
    const producto = await service.getProductoById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        message: `Producto con id ${req.params.id} no encontrado`,
      });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};
