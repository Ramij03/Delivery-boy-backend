const Cart = require('../models/cart');

module.exports = {
    addProductToCart: async (req, res) => {
        const userId = req.user.id;
        const { productId, totalPrice, quantity } = req.body;
        let count;

        try {
            const existProduct = await Cart.findOne({ userId, productId });
            count = await Cart.countDocuments({ userId });

            if (existProduct) {
                // If product already exists in the cart, update quantity and total price
                existProduct.quantity += 1;
                existProduct.totalPrice += totalPrice;
                await existProduct.save();
                return res.status(200).json({ message: 'Product updated in cart' });
            } else {
                // If product doesn't exist, create new cart item
                const newProduct = new Cart({
                    userId:userId,
                    productId: req.body.productId,
                    additives:req.bosy.additives,
                    totalPrice:req.bosy.totalPrice,
                    instructions:req.bdy.instructions,
                    quantity:req.body.quantity,
                });
                await newProduct.save();

                count=await Cart.countDocuments({userId});

                return res.status(201).json({ message: 'Product added to cart' });
            }
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    removeProductToCart: async (req, res) => {
        const userId = req.user.id;
        const productId = req.params.id;
        let count;

        try {
            const product = await Cart.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            await Cart.findByIdAndDelete({_id:productId});
            count=await Cart.countDocuments({userId});
            return res.status(200).json({ message: 'Product removed from cart' ,count});
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    fetchUserCart: async (req, res) => {
        const userId = req.user.id;

        try {
            const cartItems = await Cart.find({ userId }).
            populate({
                path:"productId",
                select:"title imageUrl restaurant rating ratingCount"
            })

            if (cartItems.length === 0) {
                return res.status(404).json({ message: 'Cart is empty' });
            }

            return res.status(200).json(cartItems);
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    clearUserCart: async (req, res) => {
        const userId = req.user.id;
        let count;
        try {
            await Cart.deleteMany({ userId });
            count= await Cart.countDocuments({userId});
            return res.status(200).json({ message: 'Cart cleared' ,count});
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    getCartCount: async (req, res) => {
        const userId = req.user.id;

        try {
            const count = await Cart.countDocuments({ userId });
            return res.status(200).json({ count });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    decrementProductQty: async (req, res) => {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        try {
            const product = await Cart.findOne({ userId, productId });

            if (!product) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            if (product.quantity <= quantity) {
                await Cart.deleteOne({ userId, productId });
                return res.status(200).json({ message: 'Product removed from cart' });
            }

            product.quantity -= quantity;
            product.totalPrice -= (product.totalPrice / product.quantity) * quantity;
            await product.save();

            return res.status(200).json({ message: 'Product quantity decreased' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    },
};
