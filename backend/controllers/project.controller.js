import projectModel from '../models/project.model.js';
import * as projectService from '../service/project.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';

export const createProject = async (req, res) => {
   
    console.log('req.user:', req.user);

    if (!req.user) {
        return res.status(400).json({ error: 'User is not authenticated' });
    }
    
    console.log("🔹 Incoming POST request to /projects/create");
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body);
    console.log("User Data:", req.user);  // Check if auth middleware works

    if (!req.body.name) {
        return res.status(400).json({ error: "Project name is required" });
    }

    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }

        const userId = req.user.userId;  

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

export const getAllProjects = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({userId: loggedInUser._id}); // ✅ Directly using req.user._id

        return res.status(200).json({
            projects: allUserProjects
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};
 