module.exports.GetUsers=async(req,res,next)=>{
    try{
        return res.json({message:'express api testing'});
    }
    catch(error){
        console.log(error);
    }
}