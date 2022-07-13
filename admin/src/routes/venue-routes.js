const express=require('express');
const router=express.Router();
const {body}=require('express-validator');

const {
    VenderSignIn, 
    GetVenueAdminProfileById, 
    UpdateEventTiming, 
    CancelEvent, 
    PostponeEvent, 
    UpdateEventseats, 
    GettingSeatAvailability,
    GetTopVenues,
    BookingSeat,
    CancelTicketBooking,
    FetchingTicketBookingDetails,
    SearchingByParameter,
    FindEventByPrice
}=require('../controller/venue-controller');

const isAuth=require('../middleware/is-auth');
const isVenueAdmin=require('../middleware/is-venueAdmin');

router.get('/gettingvenuesbyratings',GetTopVenues);
router.get('/searchevent',SearchingByParameter);

// get vender profile by id
router.get('/getvenderprofile-byid/:id',isAuth,isVenueAdmin,GetVenueAdminProfileById);
router.get('/booking-details/:id',FetchingTicketBookingDetails);
router.get('/venue-seatavailable/:id',GettingSeatAvailability);

router.post('/venueadmin-login',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password length should be atlist 6 digit long")
] ,VenderSignIn);
router.post('/searcheventbyprice',FindEventByPrice);
router.post('/booking-seats/:id',BookingSeat);
router.post('/cancel-ticketbooking/:id',CancelTicketBooking);
router.patch('/updatevenuetiming/:id',isAuth,isVenueAdmin,UpdateEventTiming);
router.patch('/cancel-event/:id',isAuth,isVenueAdmin,CancelEvent);

router.patch('/postpone-event/:id',isAuth,isVenueAdmin,PostponeEvent);
router.patch('/manageSeats-byvenueadmin/:id',isAuth,isVenueAdmin,UpdateEventseats);




module.exports=router;