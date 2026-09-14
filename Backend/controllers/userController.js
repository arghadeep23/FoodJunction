const User = require('../models/User.js');

exports.registerUser = async (req, res) => {
    const { email } = req.body;
    // check if email already exists :
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json(existingUser._id);
        }
        // Create a new user document
        const newUser = new User(req.body);
        // Save the new user document to the database
        await newUser.save();
        res.status(201).json(newUser._id);
    }
    catch (error) {
        console.error('Error saving user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
