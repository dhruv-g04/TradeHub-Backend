const jwt=require("jsonwebtoken");//Generating JWT token so that frontend can authenticate backend
const generateToken=(id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "90d",
    });
};

module.exports=generateToken;