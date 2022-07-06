const express=require('express');
const {GetAdmin,CreateAdmin, UserSignIn, GetVenueAdmin}=require('../controller/admin-controller');
const router=express.Router();
const isAuth=require('../middleware/is-auth');
const isSuperAdmin=require('../middleware/is-superadmin');


// getting admin
router.get('/get-admin',isAuth,GetAdmin);

// creating admin
router.post('/create-admin',CreateAdmin);

// login user
router.post('/login-user',UserSignIn);

// get venueadmin
router.get('/get-venderAdmin',isAuth,GetVenueAdmin);
module.exports=router;