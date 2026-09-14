const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Restaurant = require('../models/CompanySchema.js');
const geocoder = require('../config/mapbox');

exports.createRestaurant = async (req, res) => {
    const newRestaurant = new Restaurant(req.body);
    const location = newRestaurant.location;
    try {
        // Forward geocode to get coordinates
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        // Store coordinates in GeoJSON format
        newRestaurant.geometry = geoData.body.features[0].geometry;
        // Save the new restaurant to the database
        await newRestaurant.save();
        res.status(201).json({ message: "Data has been submitted to the database" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedRestaurant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.checkRestaurant = async (req, res) => {
    const { email } = req.body;
    try {
        // Find a restaurant with the provided email
        const existingRestaurant = await Restaurant.findOne({ email });

        // If a restaurant with the provided email exists, return exists: true
        if (existingRestaurant) {
            return res.json({ exists: true });
        } else {
            // If no restaurant with the provided email exists, return exists: false
            return res.json({ exists: false });
        }
    } catch (error) {
        // If an error occurs during the database operation, return a 500 status code
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.loginRestaurant = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingRestaurant = await Restaurant.findOne({ email });
        if (existingRestaurant) {
            if (await bcrypt.compare(password, existingRestaurant.password)) {
                const token = jwt.sign({ userId: existingRestaurant._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ success: true, token: token, restaurantId: existingRestaurant._id });
            }
            else {
                return res.json({ success: false, message: "Incorrect password" });
            }
        }
        else {
            return res.json({ success: false, message: "No restaurant found with this email" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.listRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRestaurant = async (req, res) => {
    const { id } = req.params;
    try {
        const restaurant = await Restaurant.findById(id);
        res.status(200).json(restaurant);
    } catch (error) {
        console.error('Error fetching resturant:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
