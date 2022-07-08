const express=require('express');
const {GetAdmin,CreateAdmin, UserSignIn, GetVenueAdmin,AddVenueDetails, RemoveAdminById, UpdateVenueLocation, RemoveVenueById}=require('../controller/admin-controller');
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
router.get('/get-venderAdmin',isAuth,isAdmin,GetVenueAdmin);

// adding venue by admin
router.post('/create-venue-byadmin',isAuth,isAdmin,AddVenueDetails);
router.patch('/update-location-byadmin/:id',isAuth,isAdmin,UpdateVenueLocation);


router.delete('/remove-adminbyid/:id',isAuth,isSuperAdmin,RemoveAdminById);
router.delete('/remove-venuebyid/:id',isAuth,isAdmin,RemoveVenueById)

module.exports=router;