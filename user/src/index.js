const express=require('express');
const app=express();

app.use('/',(req,res,next)=>{
    return res.json({message:'express api testing'});
});

app.listen(4000);