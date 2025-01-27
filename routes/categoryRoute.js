const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdmin } = require('../middleware/verifyToken');

// Define routes
router.put('/:id', verifyAdmin, categoryController.updateCategory);

router.post('/', verifyAdmin, categoryController.createCategory);

router.delete('/:id', verifyAdmin, categoryController.deleteCategory);

router.post('/image', verifyAdmin, categoryController.patchCategoryImage);

router.get('/', categoryController.getAllcategories);
router.get('/random', categoryController.getRandomCategories); // Fixed typo here from /radom to /random

module.exports = router;
