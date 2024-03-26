const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            // required : true, 
        },
        coordinates: {
            type: [Number],
            required: true
        }
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
    phone: {
        type: String
    },
    email: {
        type: String
    },
    coverPhotoURL: {
        type: String,
    },
    password: {
        type: String
    }
});
restaurantSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }
    catch (error) {
        console.log(error);
    }
});
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant; 