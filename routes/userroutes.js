const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require("path");
const { addUser, authUser } = require("../controllers/userControllers");
const { addCart, addProduct, addSelllist, removeWishList, removeSellList } = require("../controllers/productControllers");
const Authenticate = require("../middlewares/Authenticate");
const Product = require("../models/product");

const Storage = multer.diskStorage({
    destination: "../my-app/public/uploads",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '_' + uniqueSuffix + path.extname(file.originalname));
    }
})
const upload = multer({
    storage: Storage
}).single("img");

router.route('/signup').post(addUser);
router.route('/login').post(authUser);
router.route('/product/cart').post(addCart);
router.route('/product/sell').post(upload, addProduct);
router.route('/product/selllist').post(addSelllist);
router.route('/product/remove/wishlist').post(removeWishList);
router.route('/product/remove/selllist').post(removeSellList);

router.get("/aboutuser", Authenticate, (req, res) => {
    res.send(req.rootUser);
});

router.get("/logout", (req, res) => {
    res.clearCookie("jwtoken");
    res.status(200).json({ message: 'Logout Successfully' });
});


//Fetch data for React app
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        const reversedArray = products.reverse();
        res.json(reversedArray);
    } catch (error) {
        console.log('Error in fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/recentproducts', async (req, res) => {
    try {
        const products = await Product.find();
        const reversedArray = products.reverse();
        // Take the recent 10 products
        const recent10 = reversedArray.slice(0, 10);
        res.json(recent10);
    } catch (error) {
        console.log('Error in fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//?id=${productId}
router.get("/product/products_by_id", async (req, res, next) => {
    try {
        let productId = (req.query.id);
        const foundProduct = await Product.find({ _id: productId });
        return res.status(200).json({
            success: true,
            count: foundProduct.length,
            data: foundProduct,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'The product cannot be fetched' });
    }
})



module.exports = router;