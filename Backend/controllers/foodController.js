const Food = require('../models/FoodSchema.js');

exports.createFood = async (req, res) => {
    const newFood = new Food(req.body);
    try {
        await newFood.save();
        res.send("Data has been submitted to the database");
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

exports.updateFood = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedFood = await Food.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedFood);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFoodsByRestaurant = async (req, res) => {
    const id = req.params.id;
    try {
        const foods = await Food.find({ restaurantId: id });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
