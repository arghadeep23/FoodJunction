const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required : true, 
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        // required : true 
    },
    email: {
        type: String
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    address: {
        type: String
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User; 