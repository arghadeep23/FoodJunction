require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const promisify = require('util').promisify;
const randomBytes = promisify(crypto.randomBytes);
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
    methods: 'GET, POST, PUT',
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
    console.log("GET from s3URL")
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


app.post('/uploadRestaurant', async (req, res) => {
    const newRestaurant = new restaurant(req.body);
    const location = newRestaurant.location;
    const geoData = await geocoder.forwardGeocode({
        query: location,
        limit: 1
    }).send();
    console.log(geoData.body.features[0].geometry.coordinates);
    // coordinates are stored in the form of longitude, latitude : GeoJSON entity
    newRestaurant.geometry = geoData.body.features[0].geometry;
    try {
        await newRestaurant.save();
        res.send("Data has been submitted to the database");
    }
    catch (err) {
        res.status(409).json({ message: err.message });
    }
})

// creating a GET endpoint for fetching data from MongoDB
app.get('/uploads', async (req, res) => {
    try {
        const foods = await food.find();
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

app.post('/add-to-cart', async (req, res) => {
    const { userId, foodItemId } = req.body;
    try {
        let userCart = await cart.findOne({ user: userId });
        // If cart doesn't exist, create a new one
        if (!cart) {
            userCart = new cart({ user: userId, items: [] });
        }
        const existingItemIndex = userCart.items.findIndex(item => item.foodItemId.equals(foodItemId));

        if (existingItemIndex !== -1) {
            // If the item already exists, increment its quantity
            userCart.items[existingItemIndex].quantity++;
        } else {
            // If the item is not in the cart, add it
            userCart.items.push({ foodItemId, quantity: 1 });
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
app.listen(3000, () => {
    console.log('Server started at port 3000');
});
console.log("Hello World!")