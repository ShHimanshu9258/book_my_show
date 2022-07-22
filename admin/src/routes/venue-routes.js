const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const { BookingDetailsList, CancelBookingDetailsList } = require('../controller/admin-controller');
// importing controllers methods from venueController
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
    //FindEventByPrice,
    
}=require('../controller/venue-controller');


const isAuth=require('../middleware/is-auth');
const isVenueAdmin=require('../middleware/is-venueAdmin');
// getting top resturant 
// {{URL}}/gettingvenuesbyratings
router.get('/gettingvenuesbyratings',GetTopVenues);
// search event by parameters
// {{URL}}/searchevent?search=
router.get('/searchevent',SearchingByParameter);

router.get('/getbookingdetails',isAuth,isVenueAdmin,BookingDetailsList);
router.get('/getcancelbookingdetails',isAuth,isVenueAdmin,CancelBookingDetailsList);

// get vender profile by id 
//{{URL}}/getvenderprofile-byid/someid
router.get('/getvenderprofile-byid/:id',isAuth,isVenueAdmin,GetVenueAdminProfileById);

// user checking booking details by user portal
// {{URL}}/booking-details/venueId
router.get('/booking-details/:id',FetchingTicketBookingDetails);

// user checking seatsAvailability by user portal
// {{URL}}/venue-seatavailable/venueId
router.get('/venue-seatavailable/:id',GettingSeatAvailability);

// venueAdmin login routes
// {{URL}}/venueadmin-login
router.post('/venueadmin-login',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password length should be atlist 6 digit long")
] ,VenderSignIn);

// searching price filter by user
//{{URL}}/searcheventbyprice
//router.post('/searcheventbyprice',FindEventByPrice);

// ticket booking by user
//{{URL}}/booking-seats/venueId
router.post('/booking-seats/:id',BookingSeat);

// cancel ticket booking by user
//{{URL}}/cancel-ticketbooking/venueId
router.post('/cancel-ticketbooking/:id',CancelTicketBooking);

// update eventtiming
//{{URL}}/updatevenuetiming/venueId
router.patch('/updatevenuetiming/:id',isAuth,isVenueAdmin,UpdateEventTiming);

// cancel booking event by user
//{{URL}}/cancel-event/venueId
router.patch('/cancel-event/:id',isAuth,isVenueAdmin,CancelEvent);

// postpone event by venueAdmin
//{{URL}}/postpone-event/venueId
router.patch('/postpone-event/:id',isAuth,isVenueAdmin,PostponeEvent);

// update event seats by venueAdmin
//{{URL}}/manageSeats-byvenueadmin/ venueId
router.patch('/manageSeats-byvenueadmin/:id',isAuth,isVenueAdmin,UpdateEventseats);


module.exports=router;