const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router.post('/uploads', foodController.createFood);
router.put('/foods/:id', foodController.updateFood);
router.get('/foods/:id', foodController.getFoodsByRestaurant);

module.exports = router;
