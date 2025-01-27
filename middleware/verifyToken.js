const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: false, message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) {
            return res.status(403).json({ status: false, message: "Invalid Token" });
        }
        req.user = user;
        next();
    });
};

const verifyAndAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'user' || req.user.role === 'admin' || req.user.role === 'driver') {
            return next();
        } else {
            return res.status(403).json({ status: false, message: "You are not Authorized to access the Application" });
        }
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ status: false, message: "You are not Authorized to access the Application" });
        }
    });
};

const verifyDriver = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'driver' || req.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ status: false, message: "You are not Authorized to access the Application" });
        }
    });
};

const verifyVendor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'vendor' || req.user.role === 'admin') {
            return next();
        } else {
            return res.status(403).json({ status: false, message: "You are not Authorized to access the Application" });
        }
    });
};

module.exports = { verifyToken, verifyAndAuth, verifyAdmin, verifyDriver, verifyVendor };
