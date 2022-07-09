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
    CancelTicket
}=require('../controller/user-controller');
const router=express.Router();
const isAuth=require('../middleware/is-Auth');

router.get('/get-user',isAuth,GetUserProfileById);
router.get('/get-userdata',GettingUsersData);
router.get('/get-topvenues',isAuth,GettingVenues)

router.get('/get-seats-availability/:id',isAuth,GetSeatAvailability);


router.post('/create-user',CreteUser);
router.post('/user-login',UserSignIn);


router.patch('/update-address',isAuth,UpdateAddress);

router.patch('/ticket-booking/:id',isAuth,TicketBooking);
router.patch('/cancel-ticketBooking/:id',isAuth,CancelTicket);

router.delete('/removeuserbyid/:id',RemoveUserFromDatabase);

module.exports=router;