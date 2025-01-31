import userModel from '../models/user.model.js';



export const createUser = async ({
    email, password
}) => {
//throwing error if pw and email is not available

 if (!email || !password){
    throw new Error('Email and password are required');
 }
const hashedPassword = await userModel.hashPassword(password);

 const user = await userModel.create({
    email,
    password: hashedPassword
 });

 return user;

}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({});
    return users;
}

