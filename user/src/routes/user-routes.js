const express=require('express');
const {GetUsers,CreteUser, UserSignIn}=require('../controller/user-controller');
const router=express.Router();

router.get('/get-users',GetUsers);
router.post('/create-user',CreteUser);
router.post('/user-login',UserSignIn);

module.exports=router;