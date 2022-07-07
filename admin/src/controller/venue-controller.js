const User=require('../models/user');
const Address=require('../models/address');
const Event=require('../models/event');
const Venue=require('../models/venue');


const {GenerateSignature,ValidatePassword,GetDataByEmail, GetDataById}=require('../utility');

module.exports.VenderSignIn=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email,User);
        if(user){
            const validPassword= await ValidatePassword(password,user.password,user.salt);
                if(validPassword){
                    const token = await GenerateSignature({ email: user.email, id: user._id});
                    return res.status(200).json({id: user._id, token });
                }
                return res.status(400).json({message:'Password is not valid'});
        }
        return res.status(400).json({message:'No user exist with this email'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.GetVenueAdminProfileById=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await GetDataById(id,User);
        if(result){
            return res.status(200).json(result);
        }
        return res.status(422).json({message:'No Venue admin find with this id'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.UpdateEventTiming=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {timing}=req.body;
        const event=await GetDataById(id,Event);
        if(event){
            event.timing=timing;
            const eventResult=await venue.save();
            if(eventResult){
                return res.status(200).json(eventResult);
            }
            return res.status(422).json({message:'Event timing not updated'});
        }
        return res.status(422).json({message:'Event is not find with this id'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.CancelEvent=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const venue=await GetDataById(id,Event);
        if(venue){
            venue.cancelEvent= !venue.cancelEvent;
            const venueREsult=await venue.save();
            if(venueREsult){
                return res.status(200).json(venueREsult);
            }
            return res.status(422).json({message:'Event is not canceld'});
        }
        return res.status(422).json({message:'Event is not find with this id'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.PostponeEvent=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const venue=await GetDataById(id,Event);
        if(venue){
            venue.postponeEvent= new Date('July 19 , 2022 16:30:00');
            const venueREsult=await venue.save();
            if(venueREsult){
                return res.status(200).json(venueREsult);
            }
            return res.status(422).json({message:'Event is not postponeEvent'});
        }
        return res.status(422).json({message:'Event is not find with this id'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.UpdateEventseats=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {modifiedSeats,operation}=req.body;
        const event=await GetDataById(id,Event);
        if(event){
            if(operation==='increment'){
                event.totalSeats=event.totalSeats+modifiedSeats;
                event.remaningAvailableSeats=event.remaningAvailableSeats+modifiedSeats;
                const result=await event.save();
                if(result){
                    return res.status(200).json(result);
                }
                return res.status(422).json({message:'No record updated...'});
            }
            else if(operation==='decrement'){
                if(event.remaningAvailableSeats>modifiedSeats){
                    event.totalSeats=event.totalSeats-modifiedSeats;
                    event.remaningAvailableSeats=event.remaningAvailableSeats-modifiedSeats;
                    const result=await event.save();
                    if(result){
                        return res.status(200).json(result);
                    }
                    return res.status(422).json({message:'No record updated...'});
                }
                return res.status(422).json({message:'No Such operation perform remaning seats is lower then modified seats , Please change seats'});
            }
            else{
                return res.status().json({message:'No such operation performed operation should be either increment or decrement'});
            }
        }
        return res.status(422).json({message:'Event is not find with this id'});
    }
    catch(error){
        console.log(error);
    }
}



