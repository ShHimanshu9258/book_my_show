const User=require('../models/user');
const Address=require('../models/address');
const Event=require('../models/event');
const Venue=require('../models/venue');


const {GenerateSignature,ValidatePassword,GetDataByEmail}=require('../utility');

module.exports.VenderSignIn=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email,User);
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
}