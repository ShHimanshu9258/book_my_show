const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config;

// importing models
const User=require('../models/user');

const APP_SECRET=`${process.env.APP_SECRET}`
module.exports.GenerateSalt= async() =>{
   return await bcrypt.genSalt();
};

module.exports.GeneratePassword= async(password,salt)=>{
    return await bcrypt.hash(password,salt);
};

module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
    return await this.GeneratePassword(enteredPassword, salt) === savedPassword;
};

module.exports.GenerateSignature=async (payload)=>{
    return await jwt.sign(payload,APP_SECRET,{expiresIn: '1d'});
};

module.exports.ValidateSignature= async(req)=>{
    const signature = req.get('Authorization');
        if(signature){
            const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);  
            // console.log(payload); 
            return payload;
        }
        return null;
};

module.exports.GetDataAccordingRole=async(role)=>{
    try{
        const users=await User.find();
        if(users){
            let resultArray=[];
                resultArray=users.filter(users=>{
                    if(users.roles===role){
                      return  resultArray.push(users);
                    }
            });
            return resultArray;
        }
        return null;
    }   
    catch(error){
        console.log(error);
    }
};

module.exports.GetDataById=async (id)=>{
    try{
        const user=await User.findById(id);
        if(user){
            return user;
        }
        return null;
    }
    catch(error){
        console.log(error);
    }
}

module.exports.GetDataByEmail= async(email)=>{
    try{
        const user=await User.findOne({emil:email});
        if(user){
            return user;
        }
        return null;
    }
    catch(error){
        console.log(error);
    }
}

