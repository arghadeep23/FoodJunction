const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// has 2 methods : forward and reverse geocode
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports = geocoder;
