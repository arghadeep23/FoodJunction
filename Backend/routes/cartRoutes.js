const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart/:userId', cartController.getCart);
router.post('/add-to-cart', cartController.addToCart);
router.delete('/remove-from-cart', cartController.removeFromCart);

module.exports = router;
