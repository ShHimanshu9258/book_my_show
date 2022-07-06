const User=require('../models/user');

module.exports=async (req,res,next)=>{
    try{
        const user=req.user;
        if(user){
            const userResult=await User.findById(user.id);
            if(userResult){
                console.log(userResult.roles);
                if(userResult.roles==='superadmin'){
                    return next();
                }
                return res.status(404).json({message:'Your are not superAdmin to perform this action'});
            }
            return res.status(404).json({message:'No user find with this id'});
        }
        return res.status(404).json({message:'requested user is empty'});
    }
    catch(error){
        console.log(error);
    }
};