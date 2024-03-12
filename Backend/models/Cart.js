const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
    },
    items: [
        {
            foodItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'FoodItem',
                // required: true
            },
            quantity: {
                type: Number,
                // required: true,
                // default: 1
            },
            price: {
                type: Number,
                // required: true
            }
        }
    ]
})
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;