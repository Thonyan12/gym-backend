// controllers/carrito.controller.js
const service = require("../services/carrito.service");

exports.getCart = async (req, res) => {
  try {
    const memberId = Number(req.params.miembroId);
    const cartData = await service.getCartByMember(memberId);

    res.json(cartData);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.postItem = async (req, res) => {
  try {
    const memberId = Number(req.params.miembroId);
    const { productId, quantity } = req.body;

    console.log("🛒 Agregando item:", { memberId, productId, quantity });

    const item = await service.addItemToCart(memberId, productId, quantity);

    res.status(201).json(item);
  } catch (e) {
    console.error("❌ Error agregando item:", e.message);
    res.status(400).json({ message: e.message });
  }
};

exports.putItem = async (req, res) => {
  try {
    const memberId = Number(req.params.miembroId);
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;

    const item = await service.updateCartItem(memberId, itemId, quantity);

    res.json(item);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const memberId = Number(req.params.miembroId);
    const itemId = Number(req.params.itemId);

    const result = await service.removeCartItem(memberId, itemId);

    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.postCheckout = async (req, res) => {
  try {
    const memberId = Number(req.params.miembroId);

    const { cart, items } = await service.getCartByMember(memberId);
    if (!items.length) {
      return res
        .status(400)
        .json({ message: "No se puede procesar un carrito vacío" });
    }

    const processedCart = await service.checkoutCart(memberId);

    res.json({
      message: "Carrito procesado exitosamente",
      cart: processedCart,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
