const express=require('express');
const {GetAdmin,CreateAdmin, UserSignIn, GetVenueAdmin,AddVenue}=require('../controller/admin-controller');
const router=express.Router();
const isAuth=require('../middleware/is-auth');
const isSuperAdmin=require('../middleware/is-superadmin');
const isAdmin=require('../middleware/is-admin');


// getting admin
router.get('/get-admin',isAuth,isSuperAdmin,GetAdmin);

// creating admin
router.post('/create-admin',CreateAdmin);

// login user
router.post('/login-user',UserSignIn);

// get venueadmin
router.get('/get-venderAdmin',isAuth,GetVenueAdmin);

// adding venue by admin
router.post('/create-venue-byadmin/:id',isAuth,isAdmin,AddVenue);

module.exports=router;