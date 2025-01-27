const User = require('../models/User');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

module.exports = {
    createUser: async (req, res) => {
        const user = req.body;

        try {
            // Check if email exists in Firebase
            await admin.auth().getUserByEmail(user.email);
            return res.status(400).json({ message: "Email Already Exists" });
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                try {
                    // Create Firebase user
                    const userRes = await admin.auth().createUser({
                        email: user.email,
                        password: user.password,
                        emailVerified: false,
                        disabled: false
                    });

                    // Encrypt password with CryptoJS
                    const encryptedPassword = crypto.AES.encrypt(user.password, process.env.SECRET).toString();

                    // Create a new User document in MongoDB
                    const newUser = new User({
                        username: user.username,
                        email: user.email,
                        password: encryptedPassword,  // Save encrypted password
                        uid: userRes.uid,
                        role: 'user',  // Default role
                        profile: 'https://i.pinimg.com/originals/81/d3/e0/81d3e0ac5c0e1a1ec63e6533b542cc50.jpg'
                    });

                    // Save the user to MongoDB
                    await newUser.save();

                    res.status(201).json({
                        status: true,
                    });
                } catch (error) {
                    res.status(500).json({
                        status: false,
                        error: "Error Creating Account"
                    });
                }
            }
        }
    },

    loginUser: async (req, res) => {
        try {
            // Find user by email
            const user = await User.findOne({ email: req.body.email }, { __v: 0, updatedAt: 0, createdAt: 0 });

            if (!user) {
                return res.status(401).json("Wrong credentials");
            }

            // Decrypt the stored password with CryptoJS
            const decryptedPassword = crypto.AES.decrypt(user.password, process.env.SECRET).toString(crypto.enc.Utf8);

            // Compare decrypted password with provided password
            if (decryptedPassword !== req.body.password) {
                return res.status(401).json("Wrong email or password");
            }

            // Generate JWT token
            const userToken = jwt.sign({
                id: user._id,
                role: user.role,
                email: user.email,
            }, process.env.JWT_SECRET, { expiresIn: '5d' });

            // Exclude sensitive data like password and send user info with token
            const { password, email, ...others } = user._doc;

            res.status(200).json({
                ...others,
                token: userToken
            });
        } catch (err) {
            res.status(500).json({
                status: false,
                error: "Error Logging in"
            });
        }
    }
};
