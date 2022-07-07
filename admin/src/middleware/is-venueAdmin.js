const User=require('../models/user');
const {GetDataById}=require('../utility');
const {venueAdmin}=require('../models/roles');

module.exports=async (req,res,next)=>{
    try{
        const user=req.user;
        if(user){
            const userResult=await GetDataById(user.id,User);
            if(userResult){
                console.log(userResult.roles);
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