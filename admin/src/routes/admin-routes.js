const express=require('express');
const {GetAdmin,CreateAdmin}=require('../controller/admin-controller');
const router=express.Router();
// getting admin
router.get('/',GetAdmin);

// creating admin
router.post('/create-admin',CreateAdmin);

module.exports=router;