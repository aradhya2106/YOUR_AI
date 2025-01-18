
import projectModel from '../models/project.model.js';



export async function createProject({
    name, userId
}) {

    if (!name) {
        throw new Error('Name is required');
    }
    if (!userId) {
        throw new Error('UserId is required');
    }

    console.log('Creating project with:', { name, userId });
    let project;
    try {
        project = await projectModel.create({ name, user: [userId] });
        console.log('Project created successfully:', project);


    } catch (err) {
        if (err.code === 11000) {
            throw new Error('Project name must be unique');
        }
        throw err;
    }
    return project;
}



export const getAllProjectByUserId = async ({userId}) =>{
    if(!userId){
        throw new Error('UserId is required')
    }


    const allUserProjects = await projectModel.find({
        users: userId

    })

    return allUserProjects
}