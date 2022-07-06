const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv').config;

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
        // console.log(signature);
        
        if(signature){
            const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);   
            return true;
        }
        return false;
};


