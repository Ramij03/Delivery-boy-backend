const router = require('express').Router();
const restaurantController = require('../controllers/restaurantController');
const { verifyAndAuth, verifyVendor } = require('../middleware/verifyToken');

// Add a new restaurant (Only authorized users)
router.post('/', verifyAndAuth, restaurantController.addRestaurant);

// Get a specific restaurant by ID
router.get('/id/:id', restaurantController.getRestaurant);

// Get random restaurants by code or just random restaurants
router.get('/:code', restaurantController.getRandomRestaurants);

// Delete a restaurant (Only vendors can delete)
router.delete('/:id', verifyVendor, restaurantController.deleteRestaurant);

// Toggle the availability status of a restaurant (Only vendors can change availability)
router.patch('/:id', verifyVendor, restaurantController.serviceAvailability);

module.exports = router;
