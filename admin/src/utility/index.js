// bceryptjs is used for protecting password related operations
const bcrypt=require('bcryptjs');
// jsonWebToken is used for providing token and getting current user
const jwt=require('jsonwebtoken');
// getting enviromental variables
const dotenv=require('dotenv').config();

// declare global variables
const RECORDS_PER_PAGE=`${process.env.RECORDS_PER_PAGE}`;

// importing models
const User=require('../models/user');


const APP_SECRET=`${process.env.APP_SECRET}`

// generating salt which is used for creating and verifying Password
module.exports.GenerateSalt= async() =>{
   return await bcrypt.genSalt();
};

// generating password with the help of password and salt
module.exports.GeneratePassword= async(password,salt)=>{
    return await bcrypt.hash(password,salt);
};

// validating user password 
module.exports.ValidatePassword = async (enteredPassword, savedPassword, salt) => {
    return await this.GeneratePassword(enteredPassword, salt) === savedPassword;
};

//generating signature for the authentication purpose
module.exports.GenerateSignature=async (payload)=>{
    return await jwt.sign(payload,APP_SECRET,{expiresIn: '1d'});
};

// verifying signature for authorization purpose
module.exports.ValidateSignature= async(req)=>{
    const signature = req.get('Authorization');
        if(signature){
            const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET); 
            req.signature=signature; 
            // console.log(payload); 
            return payload;
        }
        return null;
};


// common method which is use to fetch data according to there id it will take 2 parameters
// 1 id and 2. table name 
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
// common method which is use to fetch data according to there email it will take 2 parameters
// 1 email and 2. table name 
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
// common method which is use to removing data according to there id it will take 2 parameters
// 1 id and 2. table name 
module.exports.RemoveDataById= async (id,Table)=>{
    try{
        console.log(Table);
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

