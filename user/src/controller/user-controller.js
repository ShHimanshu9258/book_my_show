// importing models from model folder
const User=require('../models/user');
const Address=require('../models/address');
// importing reusable function from utility
const {GeneratePassword,GenerateSalt,GenerateSignature, ValidatePassword, GetDataById,  GenerateOtp, onRequestOTP}=require('../utility');
// importing axios for cross api call
const axios=require('axios');
// importing express-validator for validation purpose
const {validationResult}=require('express-validator');
// importing dotenv for getting enviroment variables
const dotenv=require('dotenv').config();

// global variable decleration
const RECORDS_PER_PAGE=`${process.env.RECORDS_PER_PAGE}`;
const API_PATH=`${process.env.API_PATH}`;

/**
 * 
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns 
 */
module.exports.GetUserProfileById=async(req,res,next)=>{
    try{
        //const user=await GetDataById(req.user.id,User)
        // fetching user details by id
        const user=await User.findById(req.user.id);
        // throws error if user is not find
        if(!user){
            const error=new Error('No user find inside db');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(user);
    }
    // error handling it will call index.js global error handling method
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

// creating customer
module.exports.CreteUser=async(req,res,next)=>{
    try{
        // checking validation 
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            throw error;
        }
        // requested parameters
         const {email,password,name,phone}= req.body;
         //const existingUser=await GetDataByEmail(email,User);
         // fetching user data by email if exist throws error
         const existingUser=await User.findOne({email,email});
         if(existingUser){
            const error=new Error('user is already exist with this email');
            error.statusCode=422;
            throw error;
         }
         // generating salt
         const salt=await GenerateSalt();
         // generating password it will take 2 parameters 1.password 2.salt 
         const userPassword=await GeneratePassword(password,salt);
         // generating otp
         const {otp,expiry}=await GenerateOtp();
         const user=new User({
            email:email,
            phone:phone,
            address:[],
            name:name,  
            password:userPassword,
            salt:salt,
            otp:otp,
            otp_expiry:expiry
        });
        const result=await user.save();
        // throws error if db operation failed
        if(!result){
            const error=new Error('No user added inside database');
            error.statusCode=422;
            throw error;
         }
         // generating signature by parameters
             const token = await GenerateSignature({ email: result.email, id: result._id});
             return res.status(201).json({id: result._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// verified user
module.exports.VerifyUser=async(req,res,next)=>{
    try{
        const {otp}=req.body;
        const user=req.user;
        if(!user){
            const error=new Error('You are not login Please login first');
            error.statusCode=422;
            throw error;
        }
        const profile=await GetDataById(user.id,User);
        if(profile.otp===parseInt(otp) ){
            profile.verified= !profile.verified;
            const result=await profile.save();
            if(!result){
                const error=new Error('You are not login Please login first');
                error.statusCode=422;
                throw error;
            }
            const signature=await GenerateSignature({
                _id:result._id.toString(),
                email:result.email,
                verified:result.verified
            });

            return res.status(201).json({
                signature:signature,
                verified:result.verified,
                email:result.email
            });
        }
        else{
            const error=new Error('OOPS!! OTP not matched please enter valid otp, or request for new otp generation');
            error.statusCode=422;
            throw error;
        }
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.RequestOtp=async(req,res,next)=>{
    try{
        const user=req.user;
        if(!user){
            const error=new Error('You are not login Please login first');
            error.statusCode=422;
            throw error;
        }
        const userProfile=await GetDataById(user.id,User);
        if(!userProfile){
            const error=new Error('User not find with this id');
            error.statusCode=422;
            throw error;
        }
        const {otp,expiry}=await GenerateOtp();
        userProfile.otp=otp;
        userProfile.otp_expiry=expiry;
        const result=await userProfile.save();
        if(!result){
            const error=new Error('OOPS!! no record updated , Please try again');
            error.statusCode=422;
            throw error;
        }
       const otpSendResult= await onRequestOTP(otp,result.phone);
       if(!otpSendResult){
            const error=new Error('OOPS!! Otp did not sent , Please try again');
            error.statusCode=422;
            throw error;
       }
       return res.status(200).json({message:'OTP sent to your registerd mobile no....'});
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

// userLogin 
module.exports.UserSignIn= async(req,res,next)=>{
    try{
        // requested Parameter
        const {email,password}=req.body;
       
        //const user=await GetDataByEmail(email,User);
        // fetching record by email if user not found throws error
        const user=await User.findOne({email:email});
        if(!user){
            const error=new Error('No data found with this email');
            error.statusCode=422;
            throw error;
        }
        // validating userPassword it will take 3 paramterrs 1.userPassword 2.savedPassword 3.savedSalt
        const validPassword=await ValidatePassword(password,user.password,user.salt);
        if(!validPassword){
            const error=new Error('User password is not match');
            error.statusCode=422;
            throw error;
        }
        // generating signature
        const token = await GenerateSignature({ email: user.email, id: user._id});
        return res.status(201).json({id: user._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        return error;
        next(error);
    }
}
// updating user address
module.exports.UpdateAddress=async(req,res,next)=>{
    try{
        // throws error if validation failed
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 422;
            throw error;
        }
        //const existingUser=await GetDataById(req.user.id,User);
        // fettching userdetails by id
        const existingUser=await User.findById(req.user.id);
        // requesting parameters
        const {city,state,country,pincode,landmark}=req.body;

        if(!existingUser){
            const error=new Error('No user exist with this id');
            error.statusCode=422;
            throw error;
        }
        const address=new Address({
            city:city,
            pincode:pincode,
            landmark:landmark,
            country:country,
            state:state
        });
        const addressResult=await address.save();
        // throws error if db operation failed
        if(!addressResult){
            const error=new Error('OOPS!! Error occured no data inserted into db');
            error.statusCode=422;
            throw error;
        }
        existingUser.address.push(addressResult);
        const user=await existingUser.save();
        if(!user){
            const error=new Error('OOPS!! Error occured user table not updated');
            error.statusCode=422;
            throw error;
        }
        return res.status(201).json(user);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
};

// conforming seats availability from venueAdmin service
module.exports.GetSeatAvailability=async(req,res,next)=>{
    try{
        const id=req.params.id;
        // cross api call
        const response=await axios.get(`${API_PATH}/venue-seatavailable/${id}`);
        // throws error if response is null
        if(response===null){
            const error=new Error('No revord find with this id');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(response.data);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

// getting user data
module.exports.GettingUsersData= async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        console.log(req.query.page);
        // count totalrecords
        const totalRecords=await User.find().countDocuments();
        if(!totalRecords){
            const error = new Error('No Users exisits');
            error.statusCode = 422;
            throw error;
        }
        // find records
        const users=await User.find({verified:true})
        .sort({ createdAt: -1 })
        .skip((page - 1) * RECORDS_PER_PAGE)
        .limit(RECORDS_PER_PAGE);
        return res.status(200).json(users);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// removing user by admin service
module.exports.RemoveUserFromDatabase=async(req,res,next)=>{
    try{
        //const result=await RemoveDataById(req.params.id,User);
        // fetching user by id and remove if no match found throws error
        const result=await User.findByIdAndRemove(id);
        if(!result){
            const error=new Error('No data find with this id,Use different one');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json({
            message:'User deleted successfull...',
            id:result._id,
            name:result.name
        });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// finding top venues
module.exports.GettingVenues=async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        // crossapi checking if response is null then throws error
        const response=await axios.get(`${API_PATH}/gettingvenuesbyratings?page=${page}`);
        if(response===null){
            const error=new Error('No revord find with this id');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(response.data);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// ticket booking by user and call venue service call
module.exports.TicketBooking=async (req,res,next)=>{
    try{
        // const user=await GetDataById(req.user.id,User);
        // fetching existing user by id
        const user=await User.findById(req.user.id);
        // requesting parameters
        const venueId=req.params.id;
        const {noOfTickets}=req.body;
        // throws error if operation failed
        if(!user){
            const error=new Error('No User find with this id');
            error.statusCode=422;
            throw error;
        }
        // cross api call and sending data throws error if response is null
        const response=await axios.post(`${API_PATH}/booking-seats/${venueId}`,{
            user:user,
            noOfTickets:noOfTickets
        });
        if(response===null){
            const error=new Error('OOPS!! error occured Please try again');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(response.data);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// ticket booking by user and call venue service call
module.exports.CancelTicket=async(req,res,next)=>{
    try{
        // requesting parameters
        const venueId=req.params.id;
        const {noOfTickets,bookingId}=req.body;
        // const user=await GetDataById(req.user.id,User);
        // fetching data by id throws error if no data found
        const user=await findById(req.user.id);
        if(!user){
            const error=new Error('No user find with this id');
            error.statusCode=422;
            throw error;
        }
        // cross api call and sending parameters throws error if response is null
        const response=await axios.post(`${API_PATH}/cancel-ticketbooking/${venueId}`,{
            user:user,
            noOfTickets:noOfTickets,
            bookingId:bookingId
        });
        if(response===null){
            const error=new Error('OOPS!! error occured Please try again');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(response.data);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

// checking ticket booking by id
module.exports.CheckingTicketBooking=async(req,res,next)=>{
    try{
        // requesting parameters
        const ticketId=req.params.id;
        // cross api call throws error if response is null
        const response=await axios.get(`${API_PATH}/booking-details/${ticketId}`,{
            headers:{
                Autherization:req.signature
            }
        });
        if(!response){
            const error=new Error('OOPS!! error occured No response get ');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(response.data);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// searching value by paramters
module.exports.SearchingByParameter=async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        // requesting parameters
          const searchingParameter=req.query.search;
          // if requesting parameters is null or undefined throws error
          if(searchingParameter===null ||searchingParameter===undefined){
            const error =new Error('Searching parameters are empty');
            error.statusCode=422;
            throw error;
          }
          // cross api call
          const response=await axios.get(`${API_PATH}/searchevent?search=${searchingParameter} & page=${page}`);
          if(!response){
            // console.log('inside response failed');
            const error=new Error('OOPS!! error occured No response get ');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(response.data);
    }

    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// // finding event according by price
// module.exports.FindByPrice= async(req,res,next)=>{
//     try{
//           const price=req.query.price;
//           const page=req.query.page ||1;

//           if(price===null ||price===undefined){
//             const error =new Error('Searching parameters are empty');
//             error.statusCode=422;
//             throw error;
//           }
//           const response=await axios.post(`http://localhost:3002/searcheventbyprice`,{
//             price:price,
//             page:page
//           });
//           if(!response){
//             // console.log('inside response failed');
//             const error=new Error('OOPS!! error occured No response get ');
//             error.statusCode=422;
//             throw error;
//         }
//         return res.status(200).json(response.data);
//     }

//     catch(error){
//         if(!error.statusCode){
//             error.statusCode=500;
//         }
//         next(error);
//     }
// }


