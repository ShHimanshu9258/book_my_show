const express=require('express');
const {GetUsers,CreteUser}=require('../controller/user-controller');
const router=express.Router();

router.get('/',GetUsers);
router.post('/create-user',CreteUser);

module.exports=router;