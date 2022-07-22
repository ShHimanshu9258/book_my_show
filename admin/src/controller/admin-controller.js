const {faker}=require('@faker-js/faker');
const {createRandomData}=require('../utility/fakerData');
const {fakerAddress}=require('../utility/fakerAddress');
// importing models
const User=require('../models/user');
const Event=require('../models/event');
const Address=require('../models/address');
const BookingModel=require('../models/booking');
const CancelBookingModel=require('../models/cancelbooking');
const {admin,superAdmin,venueAdmin}=require('../models/roles');

// importing express-validator for getting validationRelated error
const {validationResult}=require('express-validator');

// importing reusable function from utility/index.js
const { GenerateSalt, GeneratePassword ,ValidatePassword,GenerateSignature,GetDataByEmail, GetDataById, RemoveDataById} = require('../utility');

// importing axios for cross-api data call
const axios=require('axios');

// importing dotenv for enviromental variables
const dotenv=require('dotenv').config;

// global variables dec
const RECORDS_PER_PAGE=`${process.env.RECORDS_PER_PAGE}`;
const API_PATH=`${process.env.API_PATH}`;
/**
 * switch role of a venueAdmin to admin and vice-versa by super admin
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */

// getting admin by superAdmin
module.exports.GetAdmin=async (req,res,next)=>{
    try{
        const page=req.query.page ||1;
        // reusable function which will return data according role
        const adminResult=await User.find({roles:admin})
        .sort({ createdAt: -1 })
        .skip((page - 1) * RECORDS_PER_PAGE)
        .limit(RECORDS_PER_PAGE);
        // it will through an error if no record found
        if(!adminResult){
            const error=new Error('No Data found');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(adminResult);
    }
    // handling errors and calling global error handling method at index.js 
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
};

// create admins
module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        // checking errors
        const errors=validationResult(req);
        // throws error if validation failed
        if(!errors.isEmpty()){
            const error=new Error(errors.array()[0].msg);
            error.statusCode=422;
           throw error;
        }
        // requested parameters
        const {email,password,address,name,phone}= req.body;
        //const existingUser=await GetDataByEmail(email,User);
        // checking user is already exist or not
        const existingUser=await User.findOne({email:email});
        // throws error if user is already exist
        if(existingUser){
            const error=new Error('User is alerdy registerd');
            error.statusCode=422;
            throw error;          
        }
        // generating salt
        const salt=await GenerateSalt();
        // generating password by userenterd password and salt
            const userPassword=await GeneratePassword(password,salt);
            const user=new User({
                email:email,
                phone:phone,
                address:address,
                name:name,
                password:userPassword,
                salt:salt,
                roles:superAdmin            
            });
            const result=await user.save();
            // throws error if db operation failed
            if(!result){
                const error=new Error('User not created');
                error.statusCode=422;
                throw error; 
            }
            return res.status(201).json(result);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

// usersignin
module.exports.UserSignIn=async (req,res,next)=>{
    try{
        // checking validation errors
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const error=new Error(errors.array()[0].msg);
            error.statusCode=422;
           throw error;
        }
        // requesting parameters
        const {email,password}=req.body;
        //const user=await GetDataByEmail(email,User);
        const user=await User.findOne({email:email});
        if(!user){
            const error=new Error('User not find with this email');
            error.statusCode=422;
            throw error;
        }
        // checking password is valid or not by passing user enter password saved password and salt
        const validPassword= await ValidatePassword(password,user.password,user.salt);
        // throws error if password is not valid
        if(!validPassword){
            const error=new Error('User password is not matched with saved password');
            error.statusCode=422;
            throw error;
        }
        // generating signature for requested parameters
        const token = await GenerateSignature({ email: user.email, id: user._id});
        return res.status(200).json({id: user._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

// getting venueAdmin by admin and superAdmin
module.exports.GetVenueAdmin=async(req,res,next)=>{
    try{
        const page=req.body.page || 1;
        // reusable function fetching data according to role
        const venueResult=await User.find({roles:venueAdmin})
        .sort({ createdAt: -1 })
        .skip((page - 1) * RECORDS_PER_PAGE)
        .limit(RECORDS_PER_PAGE); 
        if(!venueResult){
            const error=new Error('No venueAdmin find');
            error.statusCode=422;
            throw error;       
        }
        return res.status(200).json(venueResult);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
};

// creating event by admin
module.exports.AddVenueDetails=async(req,res,next)=>{
    try{
        // checking validation related errors
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const error=new Error(errors.array()[0].msg);
            error.statusCode=422;
           throw error;
        }
        // requesting paramerters
        const {venueType,registrationId,event,timing,totalSeats,remaningAvailableSeats,ratings,ticketPrice,address}=req.body;
        // checking if event is already regfisterd ornot by eventRegistrationId
        const existingVenue=await Event.findOne({registrationId:registrationId});
        // throws error if event is already exist
        if(existingVenue){
            const error=new Error('Venue is already registed with this registration number please try different one');
            error.statusCode=422;
            throw error;
        }
        const venue=new Event({
            event:event,
            venueType:venueType,
            registrationId:registrationId,
            timing:timing,
            totalSeats:totalSeats,
            remaningAvailableSeats:remaningAvailableSeats,
            ticketPrice:ticketPrice,
            postponeEvent:[],
            venueLocation:address,
            ratings:ratings,
        });
        const result=await venue.save();
        if(!result){
            const error=new Error('Event not created please try again');
            error.statusCode=422;
            throw error;
        }
        return res.status(201).json(result);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// removing admin by superadmin
module.exports.RemoveAdminById=async (req,res,next)=>{
    try{
        const id=req.params.id;
        //const result=await RemoveDataById(id,User);
        // removing admin by id
        const result=await User.findByIdAndRemove(id);
        // throws error if db operation failed
        if(!result){
            const error=new Error('No data removed');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json({
            message:"Record deleted successfull...",
            _id:result._id,
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
// removing event by id
module.exports.RemoveVenueById=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await RemoveDataById(id,Event);
        // throws error if db op failed
        if(!result){
            //return res.status(422).json({message:'No Record find with this id, Please use different one'});
            const error=new Error('No Record find with this id, Please use different id');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json({
            result:"Records Deleted successfull...",
            _id:result._id,
            event:result.event,
            venueType:result.venueType
        });
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
// getting user by admin from different port and different database 
module.exports.GettingUserFromUserPortal= async(req,res,next)=>{
    try{
        // it will fetching data from user service
        const page=req.query.page || 1;
        console.log(`${API_PATH}/get-userdata?page=${page}`,{
            headers:{
                Authentication:req.signature
            }
        });
        const response=await axios.get(`${API_PATH}/get-userdata?page=${page}`);
        // throws error if no users founds
        if(response===null){
            const error=new Error('No record found please try again');
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
// removing user by admin from different service
module.exports.RemoveUserFromUserService=async(req,res,next)=>{
    try{
        const id=req.params.id;
        // calling user from different service and remove
        const response=await axios.delete(`${API_PATH}/removeuserbyid/${id}`,{
            headers:{
                Authentication:req.signature
            }
        });
        return res.status(200).json(response.data);
    }
    catch(error){
        error.message=error.response.data.message;
        error.statusCode=error.response.status;
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.BookingDetailsList=async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        const result=await 
        BookingModel.find({bookingStatus:true})
        .sort({ createdAt: -1 })
        .skip((page - 1) * RECORDS_PER_PAGE)
        .limit(RECORDS_PER_PAGE);
        if(!result){
            const error=new Error("OOPS!! no data found...");
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(result);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
module.exports.CancelBookingDetailsList=async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        const result=await 
        CancelBookingModel.find({cancelBookingStatus:true})
        .sort({ createdAt: -1 })
        .skip((page - 1) * RECORDS_PER_PAGE)
        .limit(RECORDS_PER_PAGE);
        if(!result){
            const error=new Error('OOPS!! no data found...');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(result);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
       return next(error);
    }
}

module.exports.GenerateFakeData=async (req,res,next)=>{
    try{
        for(let i=0;i<20000;++i){
            const address=new Address({
                city:faker.address.cityName(),
                country:faker.address.country(),
                state:faker.address.state(),
                pincode:faker.address.zipCode(),
                streetName:faker.address.streetAddress(),
                countryCode:faker.address.countryCode()
            });
            const addressResult=await address.save();
            const salt=await GenerateSalt();
            const userPassword=await GeneratePassword('testing123',salt);
            const user=new User({
                email:faker.internet.email(),
                password:userPassword,
                roles:venueAdmin,
                address:address,
                name: faker.internet.userName(),
                phone:faker.phone.number(),
                salt:salt
            }); 
            const userResult=await user.save();
         }
        // let resultArray=[];
        // Array.from({length:1}).forEach(()=>{
        //    return resultArray.push(createRandomData());
        // })
        // console.log(resultArray);
         return res.status(200).json({message:'Data created successfull'});
    }   
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.CreateFakerEvents=async(req,res,next)=>{
    try{
       for(let i=1;i<=1000;++i){
        const address=new fakerAddress({
            city:faker.address.cityName(),
            country:faker.address.country(),
            state:faker.address.state(),
            pincode:faker.address.zipCode(),
            streetName:faker.address.streetAddress(),
            countryCode:faker.address.countryCode()
        });
        const event=new Event({
            event:faker.random.word(),
            venueType:'Adventures',
            registrationId:112258+i,
            timing:faker.date.between(),
            totalSeats:160,
            remaningAvailableSeats:160,
            ticketPrice:faker.commerce.price(),
            postponeEvent:[],
            venueLocation:address,
            ratings:4.6,
        });
        await event.save();
       }
        return res.status(200).json({message:'Record created successfull...'});
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
