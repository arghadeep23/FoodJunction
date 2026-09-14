const Cart = require('../models/Cart.js');

exports.getCart = async (req, res) => {
    const { userId } = req.params;
    try {
        const userCart = await Cart.findOne({ user: userId });
        if (userCart) {
            res.status(200).json(userCart.items);
        } else {
            res.status(200).json([]);
        }
    }
    catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    const { userId, foodItemId, price, name } = req.body;
    try {
        let userCart = await Cart.findOne({ user: userId });
        // If cart doesn't exist, create a new one
        if (!userCart) {
            userCart = new Cart({ user: userId, items: [] });
        }
        const existingItemIndex = userCart.items.findIndex(item => item.foodItemId.equals(foodItemId));

        if (existingItemIndex !== -1) {
            // If the item already exists, increment its quantity
            userCart.items[existingItemIndex].quantity++;
            userCart.items[existingItemIndex].price = price;
            userCart.items[existingItemIndex].name = name;
        } else {
            // If the item is not in the cart, add it
            userCart.items.push({ foodItemId, quantity: 1, price, name });
        }

        // Save the updated cart
        await userCart.save();
        res.status(200).json({ message: 'Item added to cart successfully' });
    }
    catch (error) {
        console.error('Error saving user cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    const { foodItemId, userId } = req.body;
    try {
        let userCart = await Cart.findOne({ user: userId });
        const existingItemIndex = userCart.items.findIndex(item => item.foodItemId.equals(foodItemId));
        if (existingItemIndex !== -1) {
            userCart.items[existingItemIndex].quantity--;
            if (userCart.items[existingItemIndex].quantity === 0) {
                userCart.items.splice(existingItemIndex, 1);
            }
        }
        await userCart.save();
        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
