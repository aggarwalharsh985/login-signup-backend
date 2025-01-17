const bcrypt = require("bcrypt");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// signup
exports.signup = async(req,res) => {
    try {
        const {name,email,password,role} = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "user already exist"
            })
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password , 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "error in hashing a password"
            });
        }
        let user = await User.create({
            name, email, password:hashedPassword, role
        })
        return res.status(200).json({
            success:true,
            message:"User create successfully"
            
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again later"
        })
    }
}


// login
exports.login = async (req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "please fill all the detail carefully",
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User in nor registered"
            })
        }
        const playload = {
            email: user.email,
            id: user._id,
            role: user.role
        };
        if(await bcrypt.compare(password,user.password)){
            let token = jwt.sign(playload , process.env.JWT_SECRET , {expiresIn: "2h",})
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true
            }
            res.cookie("token" , token , options).status(200).json({
                success: true,
                token,
                user,
                message: "user logged in successfully"
            })
        }
        else{
            return res.status(403).json({
                success: false,
                messagae: "password incorrect"
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "login failure"
        })
    }
}