const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const User = require("../models/user");

//Add product to databases
const addProduct = asyncHandler(async (req, res) => {
    try {
        const imageFilePath = req.file.filename;
        const data = req.body;
        const newProd = new Product({
            owner: data.owner,
            contact: data.contact,
            address: data.address,
            pincode: data.pincode,
            category: data.category,
            model: data.model,
            price: data.price,
            description: data.description,
            imageFilePath: imageFilePath
        });
        const result = await newProd.save();
        res.status(200).json({ item: result, message: 'Data uploaded successfully!' });
    } catch (error) {
        console.log('Error handling product upload: ', error);
        res.status(500).json({ error: 'Fill all required fields' });
    }
});
//Add product to user sell list
const addSelllist = asyncHandler(async (req, res) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: req.body.userID },
            { $push: { sellList: req.body.item } },
            { new: true } // Set { new: true } to return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ message: "Product has been added to sell list" });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error updating user sell list" });
    }
});

//Add product to user wish list
const addCart = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userID });
        const wishList = user.wishList;
        const itemExists = wishList.some((item) => item._id === req.body.item._id);

        if (itemExists) {
            res.status(201).json({ message: "Product Already Added" });
        }
        else {
            const result = await User.findOneAndUpdate(
                { _id: req.body.userID },
                { $push: { wishList: req.body.item } },
                { new: true } // Set { new: true } to return the updated document
            );

            if (!result) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(201).json({ message: "Product has been added to wish list" });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error updating user wish list" });
    }
});

//Remove product from wish list
const removeWishList = asyncHandler(async (req, res) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: req.body.userID },
            { $pull: { wishList: req.body.item } },
            { new: true } // Set { new: true } to return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ message: "Product has been removed from wish list" });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error updating user wish list" });
    }
});
//Remove product from user sell list and also from database
const removeSellList = asyncHandler(async (req, res) => {
    try {
        const productId = req.body.item._id;
        const deletedProduct = await Product.findOneAndDelete({ _id: productId });

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const result = await User.findOneAndUpdate(
            { _id: req.body.userID },
            { $pull: { sellList: req.body.item } },
            { new: true } // Set { new: true } to return the updated document
        );

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(201).json({ message: "Product has been removed from sell list" });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error updating user sell list" });
    }
});

module.exports = { addCart, addProduct, addSelllist, removeWishList, removeSellList };