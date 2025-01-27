const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    foods: { type: Array },
    pickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    owner: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    code: { type: String, required: true },
    logoUrl: {
        type: String,
        required: true,
        default: 'https://i.pinimg.com/originals/81/d3/e0/81d3e0ac5c0e1a1ec63e6533b542cc50.jpg',
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    ratingCount: { type: Number, required: false }, // Changed from String to Number
    coords: {
        id: { type: String, required: true }, // Renamed id to restaurantId for clarity
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitudeDelta: { type: Number, required: true, default:0.0122 },
        longitudeDelta: { type: Number, required: true, default:0.0221 },
        address: { type: String, required: true },
        title: { type: String, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
