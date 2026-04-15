const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['x-auth-token'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token Missing' });
    } else {
        const secret = process.env.JWT_SECRET || 'nexus_secure_key_99';
        jwt.verify(token, secret, (err, payload) => {
            if (err) {
                return res.status(403).json(err);
            } else {
                req.user = payload;
                next();
            }
        });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Admin access required' });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
