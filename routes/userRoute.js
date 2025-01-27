const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyAndAuth } = require('../middleware/verifyToken');

// Fetch user details (GET request to '/')
router.get('/', verifyAndAuth, userController.getUser);

// Delete the user (DELETE request to '/')
router.delete('/', verifyAndAuth, userController.deleteUser);

// Update user details (PUT request to '/')
router.put('/', verifyAndAuth, userController.updateUser);

module.exports = router;
