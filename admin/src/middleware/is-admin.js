// importing usermodel from models folder
const User=require('../models/user');
// importing reusable function
const {GetDataById}=require('../utility');
// importing role from roles model
const {admin}=require('../models/roles');
// checking req.user is admin or not

/**
 * checking login user is admin or not
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns 
 */
module.exports=async (req,res,next)=>{
    try{
        const user=req.user;
        if(user){
            // fetching data by id
            const userResult=await GetDataById(user.id,User);
            if(userResult){
                console.log(userResult.roles);
                // if user role is not admin then throws error
                if(userResult.roles===admin){
                    return next();
                }
                return res.status(404).json({message:'Your are not admin to perform this action'});
            }
            return res.status(404).json({message:'No user find with this id'});
        }
        return res.status(404).json({message:'requested user is empty'});
    }
    catch(error){
        console.log(error);
    }
};