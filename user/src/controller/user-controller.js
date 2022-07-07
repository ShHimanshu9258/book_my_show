const User=require('../models/user');

module.exports.GetUsers=async(req,res,next)=>{
    try{
        return res.json({message:'express api testing'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.CreteUser=async(req,res,next)=>{
    try{
         const {email,password,name,phone}= req.body;
         const user=new User({
            email:email,
            phone:phone,
            address:[],
            name:name,
            password:password,
            salt:'somesalt'
         });
         const result=await user.save();
         return res.status(201).json(result);
    }
    catch(error){
        console.log(error);
    }
}