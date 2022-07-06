const express=require('express');
const {GetAdmin,CreateAdmin, UserSignIn}=require('../controller/admin-controller');
const router=express.Router();
const isAuth=require('../middleware/is-auth');
const isSuperAdmin=require('../middleware/is-superadmin');


// getting admin
router.get('/get-admin',isAuth,isSuperAdmin,GetAdmin);

// creating admin
router.post('/create-admin',CreateAdmin);

// login user
router.post('/login-user',UserSignIn);
module.exports=router;