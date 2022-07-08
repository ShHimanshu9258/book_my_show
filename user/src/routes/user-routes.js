const express=require('express');
const {GetUserProfileById,CreteUser, UserSignIn, UpdateAddress,GetSeatAvailability}=require('../controller/user-controller');
const router=express.Router();
const isAuth=require('../middleware/is-Auth');

router.get('/get-user',isAuth,GetUserProfileById);
router.get('/get-seats-availability',isAuth,GetSeatAvailability);


router.post('/create-user',CreteUser);
router.post('/user-login',UserSignIn);


router.patch('/update-address',isAuth,UpdateAddress);

module.exports=router;