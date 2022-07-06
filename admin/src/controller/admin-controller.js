const User=require('../models/user');
module.exports.GetAdmin=async (req,res,next)=>{
    try{
        const result=await User.find();
        if(result){
            return res.status(200).json(result);
        }
        
    }
    catch(error){
        console.log(error);
    }
};

module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        const {email,password,address,name,phone}= req.body;
        const user=new User({
            email:email,
            phone:phone,
            address:address,
            name:name,
            password:password,
            serviceProvides:[],
            salt:'something'
        });
        const result=await user.save();
       
        return res.json(result);
    }
    catch(error){
        console.log(error);
    }
};