const User=require('../models/user');
const { GenerateSalt, GeneratePassword ,ValidatePassword,GenerateSignature,GetDataAccordingRole} = require('../utility');

module.exports.GetAdmin=async (req,res,next)=>{
    try{
        const adminResult=await GetDataAccordingRole('admin');
        if(adminResult){
            return res.status(200).json(adminResult);
        }
        
    }
    catch(error){
        console.log(error);
    }
};

module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        const {email,password,address,name,phone}= req.body;
        const salt=await GenerateSalt();
        const userPassword=await GeneratePassword(password,salt);
        const user=new User({
            email:email,
            phone:phone,
            address:address,
            name:name,
            password:userPassword,
            serviceProvides:[],
            salt:salt
        });
        const result=await user.save();
       if(result){
            return res.status(201).json(result);
       }
    }
    catch(error){
        console.log(error);
    }
};

module.exports.UserSignIn=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email});
        if(user){
            const validPassword= await ValidatePassword(password,user.password,user.salt);
                if(validPassword){
                    const token = await GenerateSignature({ email: user.email, id: user._id});
                    return res.status(200).json({id: user._id, token });
                }
                return res.status(400).json({message:'Password is not valid'});
        }
        return res.status(400).json({message:'No user exist with this email'});
    }
    catch(error){
        console.log(error);
    }
};

module.exports.GetVenueAdmin=async(req,res,next)=>{
    try{
        const venueResult=await GetDataAccordingRole('venueadmin'); 
        if(venueResult){
            return res.status(200).json(venueResult);
        }
        return res.status(400).json({message:'No data found'});
    }
    catch(error){
        console.log(error);
    }
};