const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { requireRestaurantAuth } = require('../middleware/auth');

router.post('/uploadRestaurant', restaurantController.createRestaurant);
router.put('/restaurants/:id', requireRestaurantAuth, restaurantController.updateRestaurant);
router.post('/checkRestaurant', restaurantController.checkRestaurant);
router.post('/restaurantLogin', restaurantController.loginRestaurant);
router.get('/restaurants', restaurantController.listRestaurants);
router.get('/restaurant/:id', restaurantController.getRestaurant);

module.exports = router;
