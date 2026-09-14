const jwt = require('jsonwebtoken');

// Requires a valid "Authorization: Bearer <token>" header issued by POST /restaurantLogin.
// On success, attaches the restaurant id from the token as req.restaurantId.
function requireRestaurantAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Missing or malformed Authorization header' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.restaurantId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

module.exports = { requireRestaurantAuth };
