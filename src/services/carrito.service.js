const carritoModel = require("../models/carrito.models");
const detalleModel = require("../models/detalleCarrito.models");
const productoModel = require("../models/producto.models");

exports.getCartByMember = async (memberId) => {
  let cart = await carritoModel.findActiveCartByMember(memberId);
  if (!cart) {
    cart = await carritoModel.createCart(memberId);
  }
  const items = await detalleModel.findItemsByCart(cart.id_carrito);
  return {
    cart: {
      id_carrito: cart.id_carrito,
      total_pago: cart.total_pago || 0, 
      procesado: cart.procesado,
    },
    items,
  };
};

exports.addItemToCart = async (memberId, productId, quantity) => {
  const product = await productoModel.find(productId);
  if (!product) throw new Error("Producto no encontrado");
  if (quantity > product.stock)
    throw new Error("Cantidad supera stock disponible");

  const { cart } = await this.getCartByMember(memberId);
  const existing = (await detalleModel.findItemsByCart(cart.id_carrito)).find(
    (i) => i.id_producto === productId
  );

  if (existing) {
    const newQty = existing.cantidad + quantity;
    if (newQty > product.stock) throw new Error("Cantidad total supera stock");
    return await detalleModel.updateCartItem(
      existing.id_detalle_carrito,
      newQty
    );
  }
  return await detalleModel.createCartItem(
    cart.id_carrito,
    productId,
    quantity,
    product.precio_prod
  );
};

exports.updateCartItem = async (memberId, itemId, quantity) => {
  const item = await detalleModel.findItemById(itemId);
  if (!item) throw new Error("Item no encontrado");

  const cart = await carritoModel.findActiveCartByMember(memberId);
  if (!cart || item.id_carrito !== cart.id_carrito)
    throw new Error("Acceso denegado");

  const product = await productoModel.find(item.id_producto);
  if (quantity > product.stock)
    throw new Error("Cantidad supera stock disponible");

  return await detalleModel.updateCartItem(itemId, quantity);
};

exports.removeCartItem = async (memberId, itemId) => {
  const item = await detalleModel.findItemById(itemId);
  if (!item) throw new Error("Item no encontrado");

  const cart = await carritoModel.findActiveCartByMember(memberId);
  if (!cart || item.id_carrito !== cart.id_carrito)
    throw new Error("Acceso denegado");

  return await detalleModel.deleteCartItem(itemId);
};

exports.checkoutCart = async (memberId) => {
  const { cart } = await this.getCartByMember(memberId);
  if (cart.procesado) throw new Error("Carrito ya procesado");
  return await carritoModel.checkoutCart(cart.id_carrito);
};
