const express=require('express');
const {GetUsers}=require('../controller/user-controller');
const router=express.Router();

router.get('/',GetUsers);

module.exports=router;