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

module.exports.GenerateOtp =async () =>  {

    const otp = Math.floor(10000 + Math.random() * 900000);
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));

    return {otp, expiry};
}

module.exports.onRequestOTP= async (otp,toPhoneNumber)=>{
    console.log(toPhoneNumber);
    // const accountSid='SK160db495947dfdf2a94345c359b5579a';
    // const authTaken='84viWMwQo27EFgEgc55vOyOBqepqWtn6';
    const accountSid='ACb185f67796dfaa981faa9e531268f69c';
    const authTaken='3f42690c5f440420fa1b272cc450ad70'
    const client=require('twilio')(accountSid,authTaken);

    const response = await client.messages
    .create({
       body: `This is a testing message ${otp}`,
       from: '+19035679227',
       to: `+91${toPhoneNumber}`
     });

    return response;
}

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


