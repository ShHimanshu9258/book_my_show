const express=require('express');
const {GetAdmin}=require('../controller/admin-controller');
const router=express.Router();
router.get('/',GetAdmin);
module.exports=router;