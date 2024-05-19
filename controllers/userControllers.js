const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
//Register
const addUser = asyncHandler(async (req, res) => {
    let { name, username, password } = req.body;
    //check if the username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(409).json({
            message: "User Already Exists"
        });
    }
    //create a new user
    password = await bcrypt.hash(password, 10);
    const user = await User.create({
        name, username, password
    });
    if (user) {
        const token = generateToken(user._id);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            path: '/', 
        }).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            wishList: user.wishList,
            sellList: user.sellList,
            message: "Registration successful",
            token: token,
        });
    } else {
        res.status(500).json({
            message: "Error Occurred",
        });
    }
});

// Login
const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateToken(user._id);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            path: '/'
        }).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            wishList: user.wishList,
            sellList: user.sellList,
            token: token,
        });
    } else {
        return res.status(401).json({
            error: "Invalid Username or Password",
        });
    }
});


module.exports = { addUser, authUser };