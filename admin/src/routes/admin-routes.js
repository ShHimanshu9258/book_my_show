const express=require('express');
const {GetAdmin,CreateAdmin, UserSignIn}=require('../controller/admin-controller');
const router=express.Router();
// getting admin
router.get('/get-admin',GetAdmin);

// creating admin
router.post('/create-admin',CreateAdmin);

// login user
router.post('/login-user',UserSignIn);
module.exports=router;