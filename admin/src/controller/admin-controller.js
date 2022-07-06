module.exports.GetAdmin=async (req,res,next)=>{
    try{
        return res.json({message:'Testing api'});
    }
    catch(error){
        console.log(error);
    }
};

module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        const {email,password,address,ownerName,name,phone}= req.body;
        return res.json({
            message:'Testing api',
            email:email,
            password:password,
            ownerName:ownerName,
            name:name,
            phone:phone,
            address:address
    });
    }
    catch(error){
        console.log(error);
    }
};