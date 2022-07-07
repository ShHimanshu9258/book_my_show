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
         const {email,password,address,name,phone}= req.body;
         return res.status(201).json({
            email:email,
            phone:phone,
            address:address,
            name:name,
            password:password
         });
    }
    catch(error){
        console.log(error);
    }
}