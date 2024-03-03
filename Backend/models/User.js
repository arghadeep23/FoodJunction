const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    given_name: {
        type: String,
        // required : true, 
    },
    family_name: {
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
    },
    nickname: {
        type: String
    },
    contact: {
        type: String
    },
    picture: {
        type: String
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User; 