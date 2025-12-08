const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token is not valid.' });
    }
};

const adminAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required.' });
        }
        next();
    });
};

const storeOwnerAuth = (req, res, next) => {
    auth(req, res, () => {
        if (req.user.role !== 'store_owner') {
            return res.status(403).json({ message: 'Store owner access required.' });
        }
        next();
    });
};


module.exports = {
    auth,
    adminAuth,
    storeOwnerAuth
};
