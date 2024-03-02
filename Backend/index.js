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
const food = require("./models/FoodSchema.js");
const restaurant = require("./models/CompanySchema.js");
const user = require("./models/User.js")
const rating = require("./models/Rating.js");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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
// app.use(express.json());
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content- Range'
};
app.use(cors(corsOptions));
// // app.use(bodyParser.json({ limit: '1mb' }));

// // app.use(multer({
// //     dest: 'images'
// // }).single('image'));

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

    // res.send("OK!!");
    try {
        const restaurants = await restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.listen(3000, () => {
    console.log('Server started at port 3000');
});
console.log("Hello World!")