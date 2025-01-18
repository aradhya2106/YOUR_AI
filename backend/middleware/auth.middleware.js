import jwt from "jsonwebtoken";
import redisClient from "../service/redis.service.js"; // Adjust path as necessary
import userModel from "../models/user.model.js";


export const authUser = async (req, res, next) => {
    try {
        console.log("🔹 Incoming Request Headers:", req.headers); 
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        console.log('Received Token:', token);
        
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized User: Token is missing.' });
        }

        // Check if the token is blacklisted in Redis
        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
            // Clear the token from cookies if it's blacklisted
            res.cookie('token', '', { maxAge: 0 });
            return res.status(401).json({ error: 'Unauthorized User: Token is blacklisted.' });
        }

        // Verify the token using JWT secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // If token is valid, attach the decoded user info to the request object
        req.user = { userId: user._id, email: user.email };


        // Proceed to the next middleware or route handler
        next();
        
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error during authentication:', error);

        // Respond with a 401 Unauthorized status and specific error message
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Unauthorized User: Invalid token.' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized User: Token has expired.' });
        }

        // Generic error handling
        res.status(500).json({ error: 'Server Error: Something went wrong during authentication.' });
    }
};
