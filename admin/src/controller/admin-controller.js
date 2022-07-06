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
        const {}=req.body;
    }
    catch(error){
        console.log(error);
    }
};