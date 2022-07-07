const express=require('express');
const {GetAdmin,CreateAdmin, UserSignIn, GetVenueAdmin,AddVenue, AddEvent, RemoveAdminById, UpdateVenueLocation}=require('../controller/admin-controller');
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
router.post('/create-venue-byadmin',isAuth,isAdmin,AddVenue);
router.post('/create-event-byadmin/:id',isAuth,isAdmin,AddEvent);
router.post('update-location-byadmin/:id',isAuth,isAdmin,UpdateVenueLocation);
router.delete('/remove-adminbyid/:id',isAuth,isSuperAdmin,RemoveAdminById)

module.exports=router;