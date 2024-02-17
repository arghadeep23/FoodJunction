const mongoose = require('mongoose');
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        // require  : true, 
    },
    open: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        // required : true,  
    },
    latitude: {
        type: Number,
        // required : true 
    },
    longitude: {
        type: Number,
        // required : true, 
    },
    likes: {
        type: Number,
        default: 0,
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    contact: {
        type: String
    },
    coverPhotoURL: {
        type: String,
    }
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant; 