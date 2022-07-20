const express=require('express');
const {body}=require('express-validator');

// importing controller methods from adminController
const {
    GetAdmin,
    CreateAdmin,
    UserSignIn, 
    GetVenueAdmin,
    AddVenueDetails, 
    RemoveAdminById,  
    RemoveVenueById, 
    GettingUserFromUserPortal, 
    RemoveUserFromUserService
}=require('../controller/admin-controller');
const router=express.Router();
const isAuth=require('../middleware/is-auth');
const isSuperAdmin=require('../middleware/is-superadmin');
const isAdmin=require('../middleware/is-admin');



// getting admin by superAdmin
// {{URL}}/get-admin
router.get('/get-admin',isAuth,isSuperAdmin,GetAdmin);

// get venueadmin
// {{URL}}/get-venderAdmin
router.get('/get-venderAdmin',isAuth,isAdmin,GetVenueAdmin);

// getting user data from another service
// {{URL}}/get-userdata
router.get('/get-userdata',isAuth,isAdmin,GettingUserFromUserPortal);

// creating admin
// {{URL}}/create-admin
router.post('/create-admin',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password length should be atlist 6 digit long"),
    body('phone').trim().isLength({min:10}).withMessage("Phone length should be  10 digit long"),
    body('name').trim().isLength({min:3}).withMessage("Name length should be atlist 10 digit long")
], CreateAdmin);

// login user
// {{URL}}/login-user
router.post('/login-user',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password length should be atlist 6 digit long")
],UserSignIn);



// adding venue by admin
// {{URL}}/create-venue-byadmin
router.post('/create-venue-byadmin',[
    body('venueType').trim().isLength({min:4}).withMessage("venueType Length should be 4 digit long"),
    body('event').trim().isLength({min:4}).withMessage("event Length should be 4 digit long"),
    body('registrationId').trim().isLength({min:6}).withMessage("REgistration id should br 6 digit long")
], isAuth,isAdmin,AddVenueDetails);


// Removing admin by superAdmin
// {{URL}}/remove-adminbyid/adminId
router.delete('/remove-adminbyid/:id',isAuth,isSuperAdmin,RemoveAdminById);

// Removing venue  by admin
// {{URL}}/remove-venuebyid/venueId
router.delete('/remove-venuebyid/:id',isAuth,isAdmin,RemoveVenueById);

// Removing user by Admin
// {{URL}}/remove-userbyid/userId
router.delete('/remove-userbyid/:id',isAuth,isAdmin,RemoveUserFromUserService);

module.exports=router;