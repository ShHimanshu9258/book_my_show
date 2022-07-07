const User=require('../models/user');
const Address=require('../models/address');
const {GeneratePassword,GenerateSalt,GenerateSignature, GetDataByEmail, ValidatePassword, GetDataById}=require('../utility');

module.exports.GetUserProfileById=async(req,res,next)=>{
    try{
        const user=await GetDataById(req.user.id,User)
        if(!user){
            const error=new Error('No user find inside db');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(user);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.CreteUser=async(req,res,next)=>{
    try{
         const {email,password,name,phone}= req.body;
         const existingUser=await GetDataByEmail(email,User);
         if(existingUser){
            const error=new Error('user is already exist with this email');
            error.statusCode=422;
            throw error;
         }
         const salt=await GenerateSalt();
         const userPassword=await GeneratePassword(password,salt);
         const user=new User({
            email:email,
            phone:phone,
            address:[],
            name:name,  
            password:userPassword,
            salt:salt
        });
        const result=await user.save();
        if(!result){
            const error=new Error('No user added inside database');
            error.statusCode=422;
            throw error;
         }
             const token = await GenerateSignature({ email: result.email, id: result._id});
             return res.status(201).json({id: result._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.UserSignIn= async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email,User);
        if(!user){
            const error=new Error('No data found with this email');
            error.statusCode=422;
            throw error;
        }
        const validPassword=await ValidatePassword(password,user.password,user.salt);
        if(!validPassword){
            const error=new Error('User password is not match');
            error.statusCode=422;
            throw error;
        }
        const token = await GenerateSignature({ email: user.email, id: user._id});
        return res.status(201).json({id: user._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.UpdateAddress=async(req,res,next)=>{
    try{
        const existingUser=await GetDataById(req.user.id,User);
        const {city,state,country,pincode,landmark}=req.body;

        if(!existingUser){
            const error=new Error('No user exist with this id');
            error.statusCode=422;
            throw error;
        }
        const address=new Address({
            city:city,
            pincode:pincode,
            landmark:landmark,
            country:country,
            state:state
        });
        const addressResult=await address.save();
        if(!addressResult){
            const error=new Error('OOPS!! Error occured no data inserted into db');
            error.statusCode=422;
            throw error;
        }
        existingUser.address.push(addressResult);
        const user=await existingUser.save();
        if(!user){
            const error=new Error('OOPS!! Error occured user table not updated');
            error.statusCode=422;
            throw error;
        }
        return res.status(201).json(user);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
};

module.exports.GetSeatAvailability=async(req,res,next)=>{
    try{
        
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}