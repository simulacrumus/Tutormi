const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('jwtSecret');

module.exports = function (req, res, next) {
    // Get the token from the header
    const token = req.header('x-auth-token');

    // Check if no token in the request header
    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied!',
            valid: false
        });
    }

    // Verifying token
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid!',
            valid: false
        });
    }
};