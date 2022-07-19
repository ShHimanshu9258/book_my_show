const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
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
// http://localhost:3002/gettingvenuesbyratings
router.get('/gettingvenuesbyratings',GetTopVenues);
// search event by parameters
// http://localhost:3002/searchevent?search=
router.get('/searchevent',SearchingByParameter);

// get vender profile by id 
//http://localhost:3002/getvenderprofile-byid/someid
router.get('/getvenderprofile-byid/:id',isAuth,isVenueAdmin,GetVenueAdminProfileById);

// user checking booking details by user portal
// http://localhost:3002/booking-details/venueId
router.get('/booking-details/:id',FetchingTicketBookingDetails);

// user checking seatsAvailability by user portal
// http://localhost:3002/venue-seatavailable/venueId
router.get('/venue-seatavailable/:id',GettingSeatAvailability);

// venueAdmin login routes
// http://localhost:3002/venueadmin-login
router.post('/venueadmin-login',[
    body('email').trim().isEmail().withMessage("Please enter a valid email"),
    body('password').trim().isLength({min:6}).withMessage("Password length should be atlist 6 digit long")
] ,VenderSignIn);

// searching price filter by user
//http://localhost:3002/searcheventbyprice
//router.post('/searcheventbyprice',FindEventByPrice);

// ticket booking by user
//http://localhost:3002/booking-seats/venueId
router.post('/booking-seats/:id',BookingSeat);

// cancel ticket booking by user
//http://localhost:3002/cancel-ticketbooking/venueId
router.post('/cancel-ticketbooking/:id',CancelTicketBooking);

// update eventtiming
//http://localhost:3002/updatevenuetiming/venueId
router.patch('/updatevenuetiming/:id',isAuth,isVenueAdmin,UpdateEventTiming);

// cancel booking event by user
//http://localhost:3002/cancel-event/venueId
router.patch('/cancel-event/:id',isAuth,isVenueAdmin,CancelEvent);

// postpone event by venueAdmin
//http://localhost:3002/postpone-event/venueId
router.patch('/postpone-event/:id',isAuth,isVenueAdmin,PostponeEvent);

// update event seats by venueAdmin
//http://localhost:3002/manageSeats-byvenueadmin/ venueId
router.patch('/manageSeats-byvenueadmin/:id',isAuth,isVenueAdmin,UpdateEventseats);


module.exports=router;