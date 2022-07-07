const express=require('express');
const router=express.Router();

router.use('/',(req,res,next)=>{
    return res.json({message:'express api testing'});
});

module.exports=router;