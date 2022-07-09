const User=require('../models/user');
const Address=require('../models/address');
const Event=require('../models/event');
const BookingModel=require('../models/booking');
const CancelBooking=require('../models/cancelbooking');
const dotenv=require('dotenv').config();

// global variable decleration
const RECORDS_PER_PAGE=`${process.env.RECORDS_PER_PAGE}`;


const {GenerateSignature,ValidatePassword,GetDataByEmail, GetDataById, RemoveDataById}=require('../utility');

module.exports.VenderSignIn=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email,User);
        if(!user){
            const error=new Error('No user exist with this email');
            error.statusCode=422;
            throw error;
        }
        const validPassword= await ValidatePassword(password,user.password,user.salt);
        if(!validPassword){
            const error=new Error('Password is not valid');
            error.statusCode=422;
            throw error;
        }
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

module.exports.GetVenueAdminProfileById=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await GetDataById(id,User);
        if(!result){
            const error=new Error('No Venue admin find with this id');
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

module.exports.UpdateEventTiming=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {timing}=req.body;
        const event=await GetDataById(id,Event);
        if(!event){
            const error=new Error('Event is not find with this id');
            error.statusCode=422;
            throw error;
        }
            event.timing=timing;
            const eventResult=await event.save();
            if(!eventResult){
                const error=new Error('Event timing not updated');
                error.statusCode=422;
                throw error; 
            }
            return res.status(200).json(eventResult);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
       }
       next(error);
    }
}

module.exports.CancelEvent=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const event=await GetDataById(id,Event);
        if(!event){
            const error=new Error('Event is not find with this id');
            error.statusCode=422;
            throw error;
        }
            event.cancelEvent= !event.cancelEvent;
            const eventREsult=await event.save();
            if(!eventREsult){
                const error=new Error('Event is not canceld');
                 error.statusCode=422;
                 throw error;
            }
            return res.status(200).json(eventREsult);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
       }
       next(error);
    }
}

module.exports.PostponeEvent=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const venue=await GetDataById(id,Event);
        if(!venue){
            const error=new Error('Event is not find with this id');
            error.statusCode=422;
            throw error;
        }
        venue.postponeEvent= new Date('July 19 , 2022 16:30:00');
        const venueREsult=await venue.save();
        if(!venueREsult){
            const error=new Error('Event is not postponeEvent');
            error.statusCode=422;
            throw error; 
        }
        return res.status(200).json(venueREsult);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
       }
       next(error);
    }
}

module.exports.UpdateEventseats=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {modifiedSeats,operation}=req.body;
        const event=await GetDataById(id,Event);
        if(!event){
            const error=new Error('Event is not find with this id..');
            error.statusCode=422;
            throw error;
        }
        if(operation==='increment'){
            event.totalSeats=event.totalSeats+modifiedSeats;
            event.remaningAvailableSeats=event.remaningAvailableSeats+modifiedSeats;
            const result=await event.save();
            if(!result){
                const error=new Error('No record updated....');
                error.statusCode=422;
                throw error;
            }
            return res.status(200).json(result);
        }
        else if(operation==='decrement'){
            if(event.remaningAvailableSeats>modifiedSeats){
                event.totalSeats=event.totalSeats-modifiedSeats;
                event.remaningAvailableSeats=event.remaningAvailableSeats-modifiedSeats;
                const result=await event.save();
                if(!result){
                    const error=new Error('No record updated....');
                    error.statusCode=422;
                    throw error;
                }
                return res.status(200).json(result);
            }
            return res.status(422).json({message:'No Such operation perform remaning seats is lower then modified seats , Please change seats'});
        }
        else{
            const error=new Error('No such operation performed operation should be either increment or decrement');
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

module.exports.GettingSeatAvailability=async(req,res,next)=>{
    try{
        const event=await GetDataById(req.params.id,Event);
        if(!event){
            const error=new Error('No Data found with this id, Please try again');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json({
            message:'Available seats',
            seatAvailability:event.seatAvailability,
            noOfseatsAvailable:event.remaningAvailableSeats
        });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
       }
       next(error);
    }
}

module.exports.GetTopVenues=async(req,res,next)=>{
    try{
        const page=req.query.page || 1;
        const totalRecords=await Event.find().countDocuments();
        if(!totalRecords){
            const error = new Error('No Venue exisits');
            error.statusCode = 422;
            throw error;
        }
        const venues=await Event.find()
        .sort({ ratings: -1 })
        .skip((page - 1) * RECORDS_PER_PAGE)
        .limit(RECORDS_PER_PAGE);
        return res.status(200).json(venues);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
       }
       next(error);
    }
}

module.exports.BookingSeat=async (req,res,next)=>{
    try{
        const event=await GetDataById(req.params.id,Event);
        const {user,noOfTickets}=req.body;
        if(!event){
            const error=new Error('No Event find with this id');
            error.statusCode=422;
            throw error;
        }
        if(event.remaningAvailableSeats >= noOfTickets){
            const booking=new BookingModel({
                userId:user._id,
                email:user.email,
                name:user.name,
                address:user.address,
                eventId:event,
                noOfTickets:noOfTickets
            });
            const bookingResult=await booking.save();
            if(!bookingResult){
                console.log('booking result failed');
                const error=new Error('OOPS!! Seat no booked, Please try again');
                error.statusCode=422;
                throw error;
            }
            event.remaningAvailableSeats=event.remaningAvailableSeats-noOfTickets;
            const eventResult=await event.save();
            if(!eventResult){
                await RemoveDataById(bookingResult._id,BookingModel);
                console.log('event result failed');
                const error=new Error('OOPS!! Error Occured event table not updated');
                error.statusCode=422;
                throw error;
            }
            return res.status(200).json({
                message:'Congratulations your Ticket booking is confirmed...',
                bookingId:bookingResult._id
            });    
        }
        else{
                return res.status(400).json({message:'OOPS no operation performed',remaningAvailableSeats:event.remaningAvailableSeats,requestData:noOfTickets});
        }
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.CancelTicketBooking= async(req,res,next)=>{
    try{
        const event=await GetDataById(req.params.id,Event);
        const {noOfTickets,user,bookingId}=req.body;
        if(!event){
            const error=new Error('No Event find with this id');
            error.statusCode=422;
            throw error;
        }
        const cancelBooking=await CancelBooking({
            email:user.email,
            name:user.name,
            address:user.address,
            userId:user._id,
            events:event,
            noOfTickets:noOfTickets
        });
        const cancelBookingResult=await cancelBooking.save();
        if(!cancelBookingResult){
            const error=new Error('OOPS!! Error occured ticket not booked..');
            error.statusCode=422;
            throw error;
        }
        event.remaningAvailableSeats=event.remaningAvailableSeats+noOfTickets;
        event.cancelBooking.push(cancelBookingResult);
        const eventResult=await event.save();
        await RemoveDataById(bookingId,BookingModel);
        if(!eventResult){
            await RemoveDataById(cancelBookingResult._id,CancelBooking);
            const error=new Error("OOPS!! Error occured your ticket booking is not canceld");
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json({
            message:'Congratulation your ticket canceld is confirmed',
            noOfTicketCanceld:noOfTickets
        });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}

module.exports.FetchingTicketBookingDetails=async(req,res,next)=>{
    try{
        const bookingDetails=await GetDataById(req.params.id,BookingModel);
        if(!bookingDetails){
            const error=new Error('Booking details not fetched with this id..');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json({
            message:'Fetching details successfull...',
            noOfTicketsBooked:bookingDetails.noOfTickets,
            name:bookingDetails.name,
            email:bookingDetails.email
        });
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}