const User=require('../models/user');
const Address=require('../models/address');
const {GeneratePassword,GenerateSalt,GenerateSignature, GetDataByEmail, ValidatePassword, GetDataById, RemoveDataById}=require('../utility');
const axios=require('axios');
const dotenv=require('dotenv').config();

// global variable decleration
const RECORDS_PER_PAGE=`${process.env.RECORDS_PER_PAGE}`;


module.exports.GetUserProfileById=async(req,res,next)=>{
    try{
        const user=await GetDataById(req.user.id,User)
        if(!user){
            const error=new Error('No user find inside db');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(user);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.CreteUser=async(req,res,next)=>{
    try{
         const {email,password,name,phone}= req.body;
         const existingUser=await GetDataByEmail(email,User);
         if(existingUser){
            const error=new Error('user is already exist with this email');
            error.statusCode=422;
            throw error;
         }
         const salt=await GenerateSalt();
         const userPassword=await GeneratePassword(password,salt);
         const user=new User({
            email:email,
            phone:phone,
            address:[],
            name:name,  
            password:userPassword,
            salt:salt
        });
        const result=await user.save();
        if(!result){
            const error=new Error('No user added inside database');
            error.statusCode=422;
            throw error;
         }
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

module.exports.UserSignIn= async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email,User);
        if(!user){
            const error=new Error('No data found with this email');
            error.statusCode=422;
            throw error;
        }
        const validPassword=await ValidatePassword(password,user.password,user.salt);
        if(!validPassword){
            const error=new Error('User password is not match');
            error.statusCode=422;
            throw error;
        }
        const token = await GenerateSignature({ email: user.email, id: user._id});
        return res.status(201).json({id: user._id, token });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.UpdateAddress=async(req,res,next)=>{
    try{
        const existingUser=await GetDataById(req.user.id,User);
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

module.exports.GetSeatAvailability=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const response=await axios.get(`http://localhost:3002/venue-seatavailable/${id}`);
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

module.exports.GettingUsersData= async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        const totalRecords=await User.find().countDocuments();
        if(!totalRecords){
            const error = new Error('No Users exisits');
            error.statusCode = 422;
            throw error;
        }
        const users=await User.find()
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

module.exports.RemoveUserFromDatabase=async(req,res,next)=>{
    try{
        const result=await RemoveDataById(req.params.id,User);
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

module.exports.GettingVenues=async(req,res,next)=>{
    try{
        console.log('inside getting user');
        const response=await axios.get(`http://localhost:3002/gettingvenuesbyratings`);
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

module.exports.TicketBooking=async (req,res,next)=>{
    try{
        const user=await GetDataById(req.user.id,User);
        const venueId=req.params.id;
        const {noOfTickets}=req.body;
        if(!user){
            const error=new Error('No User find with this id');
            error.statusCode=422;
            throw error;
        }
        const response=await axios.post(`http://localhost:3002/booking-seats/${venueId}`,{
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

module.exports.CancelTicket=async(req,res,next)=>{
    try{
        const venueId=req.params.id;
        const {noOfTickets,bookingId}=req.body;
        const user=await GetDataById(req.user.id,User);
        if(!user){
            const error=new Error('No user find with this id');
            error.statusCode=422;
            throw error;
        }
        const response=await axios.post(`http://localhost:3002/cancel-ticketbooking/${venueId}`,{
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

module.exports.CheckingTicketBooking=async(req,res,next)=>{
    try{
        const ticketId=req.params.id;
        
        const response=await axios.get(`http://localhost:3002/booking-details/${ticketId}`,{
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

module.exports.SearchingByParameter=async(req,res,next)=>{
    try{
        const urlString=req.query;
        console.log(urlString.split(':'));
        return res.status(200).json(urlString);
    }

    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}


