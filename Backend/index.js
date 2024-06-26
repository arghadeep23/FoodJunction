require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const promisify = require('util').promisify;
const randomBytes = promisify(crypto.randomBytes);
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const connectdb = require("./models/db.js");
connectdb();

// requiring the schema and model for our data
const food = require("./models/FoodSchema.js");
const restaurant = require("./models/CompanySchema.js");
const user = require("./models/User.js")
const rating = require("./models/Rating.js");
const cart = require("./models/Cart.js");

const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
var transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_APIKEY
    }
}));
const ACCESS_KEYID = process.env.ACCESS_KEYID
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY
const REGION = process.env.REGION
const BUCKET_NAME = process.env.BUCKET_NAME

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { error } = require('console');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });  // has 2 methods : forward and reverse geocode

const s3Client = new S3Client(
    {
        // user : 'argha2'
        region: REGION,
        credentials: {
            accessKeyId: ACCESS_KEYID,
            secretAccessKey: SECRET_ACCESS_KEY
        }
    }
);
async function generateUploadURL(contentType) // provides the url for the image (for putting)
{
    const rawBytes = await randomBytes(16); // generates 16 random bytes
    const imageName = rawBytes.toString('hex'); // converting the bytes into hexadecimal
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: imageName,
        // Expires: 60,
        ContentType: contentType
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
    // return null;
}
// // Middleware for parsing JSON bodies
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content- Range'
};
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log("Hello World!");
});

app.get('/s3URL', async (req, res) => {
    const url = await generateUploadURL('image/jpeg');
    // console.log("GET from s3URL")
    // res.send('Hello from s3 URL');
    res.json({ ['url']: url });
});

app.use(bodyParser.json({ limit: '50mb' }))

// creating a POST endpoint for handling data submission to MongoDB
app.post('/uploads', async (req, res) => {
    const newFood = new food(req.body);

    try {
        await newFood.save();
        res.send("Data has been submitted to the database");
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
});

app.put('/foods/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedFood = await food.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedFood);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/uploadRestaurant', async (req, res) => {
    // console.log(req.body);
    const newRestaurant = new restaurant(req.body);
    const location = newRestaurant.location;
    try {
        // Forward geocode to get coordinates
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        // Store coordinates in GeoJSON format
        newRestaurant.geometry = geoData.body.features[0].geometry;
        // Save the new restaurant to the database
        await newRestaurant.save();
        res.status(201).json({ message: "Data has been submitted to the database" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.put('/restaurants/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const updatedRestaurant = await restaurant.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedRestaurant);
    } catch (err) {
        res.status(500).json({ messgae: error.message });
    }
})
app.post('/checkRestaurant', async (req, res) => {
    const { email } = req.body;
    try {
        // Find a restaurant with the provided email
        const existingRestaurant = await restaurant.findOne({ email });

        // If a restaurant with the provided email exists, return exists: true
        if (existingRestaurant) {
            return res.json({ exists: true });
        } else {
            // If no restaurant with the provided email exists, return exists: false
            return res.json({ exists: false });
        }
    } catch (error) {
        // If an error occurs during the database operation, return a 500 status code
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/restaurantLogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingRestaurant = await restaurant.findOne({ email });
        if (existingRestaurant) {
            if (bcrypt.compare(existingRestaurant.password, password)) {
                const secretKey = crypto.randomBytes(32).toString('hex');
                const token = jwt.sign({ userId: existingRestaurant._id }, secretKey, { expiresIn: '1h' });
                return res.json({ success: true, token: token, restaurantId: existingRestaurant._id });
            }
            else {
                return res.json({ success: false, message: "Incorrect password" });
            }
        }
        else {
            return res.json({ success: false, message: "No restaurant found with this email" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})
// creating a GET endpoint for fetching food data from MongoDB
app.get('/foods/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const foods = await food.find({ restaurantId: id });
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/register', async (req, res) => {
    const { email } = req.body;
    //check if email already exists : 
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(200).json(existingUser._id);
        }
        // Create a new user document
        // const { nickname, picture } = req.body;
        const newUser = new user(req.body);
        // Save the new user document to the database
        await newUser.save();
        // Send welcome email
        try {
            await transporter.sendMail({
                to: email,
                from: 'deyarghadeep23@gmail.com',
                subject: 'Welcome to FoodJunction!',
                html: '<h1>You have successfully been registered!</h1>'
            });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // You can choose to handle the email sending error differently, e.g., send a response to the client indicating that the email failed to send.
        }
        res.status(201).json(newUser._id);
    }
    catch (error) {
        console.error('Error saving user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// endpoint for fetching user cart
app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userCart = await cart.findOne({ user: userId });
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
}
);

app.post('/add-to-cart', async (req, res) => {
    const { userId, foodItemId, price, name } = req.body;
    try {
        let userCart = await cart.findOne({ user: userId });
        // If cart doesn't exist, create a new one
        if (!userCart) {
            userCart = new cart({ user: userId, items: [] });
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
})

app.delete('/remove-from-cart', async (req, res) => {
    // console.log("request to delete");
    const { foodItemId, userId } = req.body;
    try {
        let userCart = await cart.findOne({ user: userId });
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
});

app.get('/restaurant/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const resturant = await restaurant.findById(id);
        res.status(200).json(resturant);
    } catch (error) {
        console.error('Error fetching resturant:', error);
        res.status(500).json({ message: 'Server error' });
    }
})
app.listen(3000, () => {
    console.log('Server started at port 3000');
});
console.log("Hello World!")