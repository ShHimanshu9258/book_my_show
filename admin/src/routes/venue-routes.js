const express=require('express');
const router=express.Router();

const {VenderSignIn, GetVenueAdminProfileById, UpdateEventTiming, CancelEvent, PostponeEvent, UpdateEventseats, GettingSeatAvailability}=require('../controller/venue-controller');

const isAuth=require('../middleware/is-auth');
const isVenueAdmin=require('../middleware/is-venueAdmin');

// get vender profile by id
router.get('/getvenderprofile-byid/:id',isAuth,isVenueAdmin,GetVenueAdminProfileById);

router.get('/venue-seatavailable/:id',GettingSeatAvailability);
router.post('/venueadmin-login',VenderSignIn);

router.patch('/updatevenuetiming/:id',isAuth,isVenueAdmin,UpdateEventTiming);
router.patch('/cancel-event/:id',isAuth,isVenueAdmin,CancelEvent);

router.patch('/postpone-event/:id',isAuth,isVenueAdmin,PostponeEvent);
router.patch('/manageSeats-byvenueadmin/:id',isAuth,isVenueAdmin,UpdateEventseats);


module.exports=router;