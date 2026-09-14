const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { requireRestaurantAuth } = require('../middleware/auth');

router.post('/uploads', requireRestaurantAuth, foodController.createFood);
router.put('/foods/:id', requireRestaurantAuth, foodController.updateFood);
router.get('/foods/:id', foodController.getFoodsByRestaurant);

module.exports = router;
