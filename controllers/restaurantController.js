const Restaurant = require('../models/Restaurant');

module.exports = {
    addRestaurant: async (req, res) => {
        const newRestaurant = new Restaurant(req.body);
        try {
            await newRestaurant.save();
            res.status(201).json({ status: true, message: "Restaurant created successfully" });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error creating restaurant" });
        }
    },

    serviceAvailability: async (req, res) => {
        const { id: restaurantId } = req.params; // Destructure id from req.params
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ status: false, message: "Restaurant not found" });
            }

            restaurant.isAvailable = !restaurant.isAvailable; // Toggle availability
            await restaurant.save();
            res.status(200).json({
                status: true,
                message: restaurant.isAvailable ? "Restaurant is now available" : "Restaurant is now unavailable",
                isAvailable: restaurant.isAvailable
            });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error updating availability" });
        }
    },

    deleteRestaurant: async (req, res) => {
        const { id: restaurantId } = req.params; // Destructure id from req.params
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ status: false, message: "Restaurant not found" });
            }

            await Restaurant.findByIdAndDelete(restaurantId);
            res.status(200).json({ status: true, message: "Restaurant deleted successfully" });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error deleting restaurant" });
        }
    },

    getRestaurant: async (req, res) => {
        const { id: restaurantId } = req.params; // Destructure id from req.params
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ status: false, message: "Restaurant not found" });
            }

            res.status(200).json({ status: true, restaurant });
        } catch (err) {
            res.status(500).json({ status: false, message: "Error fetching restaurant" });
        }
    },

    getRandomRestaurants: async (req, res) => {
        try {
            let randomRest = [];
            if (req.params.code) {
                randomRest = await Restaurant.aggregate([
                    { $match: { code: req.params.code } },
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            if (!randomRest.length) {
                randomRest = await Restaurant.aggregate([
                    { $sample: { size: 5 } },
                    { $project: { __v: 0 } }
                ]);
            }
            if (randomRest.length) {
                res.status(200).json(randomRest);
            } else {
                res.status(404).json({ status: false, message: "No restaurants found" });
            }
        } catch (err) {
            res.status(500).json({ status: false, message: "Error suggesting restaurants" });
        }
    }
};
