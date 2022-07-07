const User=require('../models/user');
const {GeneratePassword,GenerateSalt,GenerateSignature, GetDataByEmail}=require('../utility');
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
         const existingUser=await GetDataByEmail(email,User);
         if(!existingUser){
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
             if(result){
                return res.status(201).json(result);
             }
             return res.status(422).json({message:'No user added inside database'});
             
         }
         return res.status(422).json({message:'user is already exist with this email'});
         
    }
    catch(error){
        console.log(error);
    }
}