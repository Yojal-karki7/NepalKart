import userModel from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// Controller for user login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({success: false, message: 'All fields are required!'})
        }
        const user = await userModel.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User doesn't exists!"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch) {
            const token = createToken(user._id);
            res.json({success: true, token})
        }
        else{
            return res.json({success: false, message: 'Invalid password!'})
        }
    } catch (error) {
        console.log(error)  
        if(!isMatch) {
            return res.json({success: false, message: error.message})
        }
     }
}

// Controller for user register
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        // checking if the user already exists or not
        const exists = await userModel.findOne({email});
        if(exists) {
            return res.json({success: false, message: 'User already exists'})
        } 
        // Validating email format & strong password
        if(!validator.isEmail(email)) {
            return res.json({success: false, message: 'Email is not valid!'})
        }
        if(password.length < 8) {
            return res.json({success: false, message: 'Password must be atleast 8 characters!'})
        }
        // hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
       const user = await newUser.save();
       
       const token = createToken(user._id);

       res.json({success: true, token})
    } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message})
    }
}


// Controller for admin login

const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success: true, token})
        }else {
            res.json({success: false, message: 'Invalid Credentials!'})
        }
    } catch (error) {
        console.log(error);
    res.json({success: false, message: error.message})
    }
}

export {
    loginUser,
    registerUser,
    adminLogin,
}