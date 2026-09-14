require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const connectdb = require("./models/db.js");
connectdb();

const uploadRoutes = require('./routes/uploadRoutes');
const foodRoutes = require('./routes/foodRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();

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
});

app.use(uploadRoutes);

app.use(bodyParser.json({ limit: '50mb' }));

app.use(foodRoutes);
app.use(restaurantRoutes);
app.use(userRoutes);
app.use(cartRoutes);

app.listen(3000, () => {
    console.log('Server started at port 3000');
});
