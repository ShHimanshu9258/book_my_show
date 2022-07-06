const User=require('../models/user');
const Venue = require('../models/venue');
const { GenerateSalt, GeneratePassword ,ValidatePassword,GenerateSignature,GetDataAccordingRole,GetDataByEmail, GetDataById} = require('../utility');

module.exports.GetAdmin=async (req,res,next)=>{
    try{
        const adminResult=await GetDataAccordingRole('admin');
        if(adminResult){
            return res.status(200).json(adminResult);
        }
        return res.status(400).json({message:'No Data found'});
    }
    catch(error){
        console.log(error);
    }
};

module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        const {email,password,address,name,phone}= req.body;
        const existingUser=await GetDataByEmail(email);
        if(!existingUser){
            const salt=await GenerateSalt();
            const userPassword=await GeneratePassword(password,salt);
            const user=new User({
                email:email,
                phone:phone,
                address:address,
                name:name,
                password:userPassword,
                salt:salt
            });
            const result=await user.save();
            if(result){
                return res.status(201).json(result);
            }
        }
        return res.status(422).json({message:'User is alerdy registerd'});
        
    }
    catch(error){
        console.log(error);
    }
};

module.exports.UserSignIn=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email);
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

module.exports.UpdateVenueLocation=async(req,res,next)=>{

};

module.exports.AddVenue=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {venueType,registrationId,timing}=req.body;
        const existingVenue=await Venue.findOne({registrationId:registrationId});
        if(!existingVenue){
            const venue=new Venue({
                venueType:venueType,
                registrationId:registrationId,
                timing:timing,
                postponeEvent:[],
                venueLocation:[],
                event:[]
            });
            const result=await venue.save();
            if(result){
                return res.status(201).json(result);
            }
            return res.status(422).json({message:'Venue not cretaed please try again'});
        }
        return res.status(422).json({message:'Venue is already registed with this registration number please try different one'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.AddEvent=async(req,res,next)=>{
    try{
        const id=req.params.id;

    }
    catch(error){
        console.log(error);
    }
}