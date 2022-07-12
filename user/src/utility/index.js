const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config();

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
        req.signature=signature;
        if(signature){
            const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);  
            // console.log(payload); 
            return payload;
        }
        return null;
};


module.exports.GetDataById=async (id,Table)=>{
    try{
        const user=await Table.findById(id);
        if(user){
            return user;
        }
        return null;
    }
    catch(error){
        console.log(error);
    }
}

module.exports.GetDataByEmail= async(email,Table)=>{
    try{
        const user=await Table.findOne({email:email});
        if(user){
            return user;
        }
        return null;
    }
    catch(error){
        console.log(error);
    }
}

module.exports.RemoveDataById= async (id,Table)=>{
    try{
        // console.log(Table);
        const result=await Table.findByIdAndRemove(id);
        if(result){
            return result;
        }
        return null;
    }
    catch(error){
        console.log(error);
    }
}


