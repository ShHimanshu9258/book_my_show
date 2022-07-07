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
             return res.status(200).json({id: result._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}