const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/carrito.controller');
const { authenticateToken, requireMember } = require('../middleware/auth');

router.get('/:miembroId/cart',              authenticateToken, requireMember, ctrl.getCart);
router.post('/:miembroId/cart/item',        authenticateToken, requireMember, ctrl.postItem);
router.put('/:miembroId/cart/item/:itemId', authenticateToken, requireMember, ctrl.putItem);
router.delete('/:miembroId/cart/item/:itemId', authenticateToken, requireMember, ctrl.deleteItem);
router.post('/:miembroId/cart/checkout',    authenticateToken, requireMember, ctrl.postCheckout);

module.exports = router;