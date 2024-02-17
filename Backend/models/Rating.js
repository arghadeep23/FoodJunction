const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        // required : true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // required : true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String
    }
});
const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating; 