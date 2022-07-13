const express=require('express');
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
    FindByPrice
}=require('../controller/user-controller');
const {body}=require('express-validator');
const router=express.Router();
const isAuth=require('../middleware/is-Auth');

router.get('/searchByPrice',isAuth,FindByPrice);
router.get('/searching',isAuth,SearchingByParameter);
router.get('/get-user',isAuth,GetUserProfileById);
router.get('/get-userdata',GettingUsersData);
router.get('/get-topvenues',isAuth,GettingVenues);
router.get('/ticket-bookingdetails/:id',isAuth,CheckingTicketBooking);

router.get('/get-seats-availability/:id',isAuth,GetSeatAvailability);


router.post('/create-user',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password Length should be atlist 6 digit long"),
    body('name').isLength({min:3}).withMessage("Name Length should be atlist 3 digit long"),
    body('phone').trim().isLength({min:10}).withMessage("phone Length should be atlist 10 digit long")
],CreteUser);
router.post('/user-login',[
    body('email').trim().isEmail().withMessage("Please enter a valid email id"),
    body('password').trim().isLength({min:6}).withMessage("Password Length should be atlist 6 digit long")
],UserSignIn);


router.patch('/update-address',[
    body('pincode').isLength({min:6}).withMessage("Pincode length should be 6 digit long")
],isAuth,UpdateAddress);

router.patch('/ticket-booking/:id',isAuth,TicketBooking);
router.patch('/cancel-ticketBooking/:id',isAuth,CancelTicket);

router.delete('/removeuserbyid/:id',RemoveUserFromDatabase);

module.exports=router;