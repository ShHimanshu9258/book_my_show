const express=require('express');
// importing userController methods from userController
const {
    GetUserProfileById,
    CreteUser, 
    UserSignIn, 
    UpdateAddress,
    GetSeatAvailability, 
    GettingUsersData, 
    RemoveUserFromDatabase,
    GettingVenues,
    TicketBooking,
    CancelTicket,
    CheckingTicketBooking,
    SearchingByParameter,
    //FindByPrice,
    VerifyUser,
    RequestOtp
}=require('../controller/user-controller');
// importing express-validator for validating data
const {body}=require('express-validator');
const router=express.Router();
// importing authentication middleware
const isAuth=require('../middleware/is-Auth');

// searching event by price
// http://localhost:4002/searchByPrice
// router.get('/searchByPrice',isAuth,FindByPrice);

//request otp
router.get('/otprequest',isAuth,RequestOtp);

// searching event by parameters
// http://localhost:4002/searching
router.get('/searching',isAuth,SearchingByParameter);

// getting user profile by id
// http://localhost:4002/get-user
router.get('/get-user',isAuth,GetUserProfileById);

// getting user data by admin 
// http://localhost:4002/get-userdata
router.get('/get-userdata',GettingUsersData);

// getting top venue details by venue service
// http://localhost:4002/get-topvenues
router.get('/get-topvenues',isAuth,GettingVenues);

// checking ticket availability by venue service
// http://localhost:4002/ticket-bookingdetails/:id
router.get('/ticket-bookingdetails/:id',isAuth,CheckingTicketBooking);

// seat availability
// http://localhost:4002/get-seats-availability/id
router.get('/get-seats-availability/:id',isAuth,GetSeatAvailability);

// create user
// http://localhost:4002/create-user
router.post('/create-user',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password Length should be atlist 6 digit long"),
    body('name').isLength({min:3}).withMessage("Name Length should be atlist 3 digit long"),
    body('phone').trim().isLength({min:10}).withMessage("phone Length should be atlist 10 digit long")
],CreteUser);

// login user
// http://localhost:4002/user-login
router.post('/user-login',[
    body('email').trim().isEmail().withMessage("Please enter a valid email id"),
    body('password').trim().isLength({min:6}).withMessage("Password Length should be atlist 6 digit long")
],UserSignIn);

// update user address
// http://localhost:4002/update-address
router.patch('/update-address',[
    body('pincode').isLength({min:6}).withMessage("Pincode length should be 6 digit long")
],isAuth,UpdateAddress);

// verify user
// http://localhost:4002/verify-user
router.patch('/verify-user',isAuth,VerifyUser);

// ticket booking
// http://localhost:4002/ticket-booking/id
router.patch('/ticket-booking/:id',isAuth,TicketBooking);

// cancel ticket booking
// http://localhost:4002/cancel-ticketBooking/ticketbookingId
router.patch('/cancel-ticketBooking/:id',isAuth,CancelTicket);

// remove user by admin
// http://localhost:4002/removeuserbyid/userId
router.delete('/removeuserbyid/:id',RemoveUserFromDatabase);

module.exports=router;