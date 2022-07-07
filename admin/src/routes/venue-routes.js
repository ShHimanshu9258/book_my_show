const express=require('express');
const router=express.Router();

const {VenderSignIn}=require('../controller/venue-controller');

router.post('/venueadmin-login',VenderSignIn);

module.exports=router;