// importing models from modelFolder
const User=require('../models/user');
const {venueAdmin}=require('../models/roles');
// importing reusable service from utility
const {GetDataById}=require('../utility');


module.exports=async (req,res,next)=>{
    try{
        const user=req.user;
        if(user){
            // fetching details from id
            const userResult=await GetDataById(user.id,User);
            if(userResult){
                console.log(userResult.roles);
                // checking user is venueAdmin or not
                if(userResult.roles===venueAdmin){
                    return next();
                }
                return res.status(404).json({message:'Your are not venue admin to perform this action'});
            }
            return res.status(404).json({message:'No user find with this id'});
        }
        return res.status(404).json({message:'requested user is empty'});
    }
    catch(error){
        console.log(error);
    }
};