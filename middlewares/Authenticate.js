const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Authenticate = async (req, res, next) => {

    try {
        const token = req.cookies.jwtoken;
        // console.log(token);
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

        const rootUser = await User.findOne({ _id: verifyToken.id });
        if (!rootUser) { throw new Error('user not found') };
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        // console.log(req);
        next();
    }
    catch (err) {
        res.status(401).send("Unauthoirized:No token provided");
        // console.log("there is an error", err);
    }
}

module.exports = Authenticate;