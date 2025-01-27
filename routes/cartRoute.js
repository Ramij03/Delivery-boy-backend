const router=require('express').Router();
const cartController=require('../controllers/cartController');
const { verifyAndAuth } = require('../middleware/verifyToken');

router.post('/',verifyAndAuth, cartController.addProductToCart);

router.post('/decrement',verifyAndAuth, cartController.decrementProductQty);

router.delete('/delete/:id',verifyAndAuth, cartController.removeProductToCart);

router.get('',verifyAndAuth, cartController.fetchUserCart);

router.get('/count',verifyAndAuth,cartController.getCartCount);

router.delete('/clear/',verifyAndAuth,cartController.clearUserCart)

module.exports=router;