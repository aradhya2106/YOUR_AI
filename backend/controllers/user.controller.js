import * as userService from '../service/user.service.js';
import userModel from '../models/user.model.js';
  import { validationResult } from 'express-validator';
  import User from "../models/user.model.js";
  import jwt from 'jsonwebtoken';

import bcrypt from "bcrypt";

  import redisClient from '../service/redis.service.js';
  
  export const createUserController = async (req, res) => {

   
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Duplicate email registration attempt");
            return res.status(400).send({ errors: "User already exists" });
        }

        // Inside createUserController
        const hashedPassword = await User.hashPassword(password);
        

        //delete User._doc.password;


     // Create and save user
     const newUser = new User({ email, password: hashedPassword });
     await newUser.save();
      // Remove password from the response
      const userResponse = { ...newUser._doc };
      delete userResponse.password;
    
     res.status(201).send({ message: "User registered successfully",  user: userResponse, });
 } catch (error) {
    console.error("Error in createUserController:", error); 
     res.status(500).send({ errors: "Server error",  details: error.message });
 }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for email:", email);


        // Find user and include password explicitly
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log("User not found");
            return res.status(400).send({ errors: "Invalid credentials" });
        }

        // Validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            console.log("Invalid password for user:", user.email);
            return res.status(400).send({ errors: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log("Login successful:", user.email);

        // Send token in cookies and response
         // Send token and user info
         res.status(200).send({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
            },
           token: token,
        });
    } catch (error) {
        console.error("Login error:",error);
        res.status(500).send({ errors: "Server error" , message: error.message});
    }
};

  export const profileController = async (req, res) => {
     
console.log(req.user);

res.status(200).json({
    user: req.user
});

}

  export const logoutController = async (req, res) => {
    try {
       
        const token = req.cookies.token || req.headers.authorization.
        split(' ')[ 1 ];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Logged out successfully'
        }); 



    } catch (err) {
        res.status(500).send({ errors: "Server error", message: err.message });
    }
  }