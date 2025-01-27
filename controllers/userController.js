const User = require('../models/User');

module.exports = {

    getUser: async (req, res) => {
        const userId = req.user.id;
        try {
            const user = await User.findById(
                { _id: userId },
                { password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
            );
            res.status(200).json({ status: true, user });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error retrieving user", error: err.message });
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.user.id;
        try {
            await User.findByIdAndDelete(userId);
            res.status(200).json({ status: true, message: "User deleted successfully" });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error deleting user", error: err.message });
        }
    },

    updateUser: async (req, res) => {
        const userId = req.user.id;
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: req.body },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(400).json({ status: false, message: "No changes were made to the user" });
            }
            res.status(200).json({ status: true, message: "User updated", user: updatedUser });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error updating user", error: err.message });
        }
    }
};
