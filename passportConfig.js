const User = require("./models/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
    passport.use(
        new localStrategy(async (username, password, done) => {
            try {
                const data = await User.findOne({ username: username });
                if (!data) {
                    return done(null, false,{ message: "No User exists" });
                }
                bcrypt.compare(password, data.password, (err, result) => {
                    if (err) throw err;
                    if (result == true) {
                        return done(null, data);
                    }
                    else {
                        return done(null, false, { message: "Invalid password" });
                    }
                });
            } catch (err) {
                console.error("Error during login: ", err);
                return done(err);
            }
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ _id: id });
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};