const router = require('express').Router();
const foodController = require('../controllers/foodController');
const { verifyVendor } = require('../middleware/verifyToken');

//adding food names, food tags, and food types
router.post('/', verifyVendor,foodController.addFood);
router.post('/tags/:id',verifyVendor, foodController.addFoodTags);
router.post('/type/:id',verifyVendor, foodController.addFoodTags);

//get food by id, or get food by code, or get food by code and category
router.get('/:id',foodController.getFoodbyId);
router.get('/:code',foodController.getRandomFoodbyCode);
router.get('/"category/:code',foodController.getRandomFoodbyCodeandCategory);

//delete foods
router.delete('/:id',verifyVendor,foodController.deleteFoodbyId)

//availability
router.patch('/:id',verifyVendor,foodController.foodAvailability);

//get food by restaurant
router.get('/restaurant/:restaurandId',foodController.getFoodbyRestaurant)


module.exports= router;