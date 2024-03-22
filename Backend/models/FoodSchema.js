const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        // required : true
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        // required: true,
    },
    imageURL: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
    },
    orders: {
        type: Number,
    },
    category: {
        type: String
    }

});
const Food = mongoose.model("Food", foodSchema);

module.exports = Food;