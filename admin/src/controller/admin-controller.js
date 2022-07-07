const User=require('../models/user');
const Venue = require('../models/venue');
const Event=require('../models/event');
const {admin,superAdmin,venueAdmin}=require('../models/roles');
const { GenerateSalt, GeneratePassword ,ValidatePassword,GenerateSignature,GetDataAccordingRole,GetDataByEmail, GetDataById, RemoveDataById} = require('../utility');



module.exports.GetAdmin=async (req,res,next)=>{
    try{
        const adminResult=await GetDataAccordingRole('admin');
        if(adminResult){
            return res.status(200).json(adminResult);
        }
        return res.status(400).json({message:'No Data found'});
    }
    catch(error){
        console.log(error);
    }
};

module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        const {email,password,address,name,phone}= req.body;
        const existingUser=await GetDataByEmail(email);
        if(!existingUser){
            const salt=await GenerateSalt();
            const userPassword=await GeneratePassword(password,salt);
            const user=new User({
                email:email,
                phone:phone,
                address:address,
                name:name,
                password:userPassword,
                salt:salt,
                roles:admin
            });
            const result=await user.save();
            if(result){
                return res.status(201).json(result);
            }
        }
        return res.status(422).json({message:'User is alerdy registerd'});
        
    }
    catch(error){
        console.log(error);
    }
};

module.exports.UserSignIn=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email);
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
};

module.exports.GetVenueAdmin=async(req,res,next)=>{
    try{
        const venueResult=await GetDataAccordingRole('venueadmin'); 
        if(venueResult){
            return res.status(200).json(venueResult);
        }
        return res.status(400).json({message:'No data found'});
    }
    catch(error){
        console.log(error);
    }
};

module.exports.UpdateVenueLocation=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {city,state,pincode,country,landmark}=req.body;
        const venue=await Venue.findById(id);
        if(venue){
            const address=new Address({
                city:city,
                state:state,
                country:country,
                pincode:pincode,
                landmark:landmark
            });
            const result=await address.save();
            if(result){
                venue.venueLocation.push(result);
                const venueResult=await venue.save();
                if(venueResult){
                    return res.status(201).json(venueResult);
                }
                return res.json({message:'No Venue updated ...'});
            }
            return res.json({message:'No Location updtaed please try again'});
        }
        return res.json({message:'No venue available with this id...'});
    }
    catch(error){
        console.log(error);
    }
};

module.exports.AddVenue=async(req,res,next)=>{
    try{
        const {venueType,registrationId,timing}=req.body;
        const existingVenue=await Venue.findOne({registrationId:registrationId});
        if(!existingVenue){
            const venue=new Venue({
                venueType:venueType,
                registrationId:registrationId,
                timing:timing,
                postponeEvent:[],
                venueLocation:[],
                event:[]
            });
            const result=await venue.save();
            if(result){
                return res.status(201).json(result);
            }
            return res.status(422).json({message:'Venue not cretaed please try again'});
        }
        return res.status(422).json({message:'Venue is already registed with this registration number please try different one'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.AddEvent=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {event,imdbId,totalSeats,remaningAvailableSeats,ratings}=req.body;
        const venue=await Venue.findById(id);
        const existingEvent=await Event.findOne({imdbId:imdbId});
        if(venue!==null && existingEvent===null){
            const eventModel=new Event({
                event:event,
                imdbId:imdbId,
                totalSeats:totalSeats,
                remaningAvailableSeats:remaningAvailableSeats,
                ratings:ratings
            });
            const eventResult=await eventModel.save();
            if(eventResult){
                venue.event.push(eventResult);
                const venueResult=await venue.save();
                if(venueResult){
                    return res.status(201).json(venueResult);
                }
                return res.json({message:'OOPS!! Venue table not updated...'});
            }
            return res.json({message:'No Data inserted into event table'});
        }
        return res.json({message:'Event is already generated with this id...'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.RemoveAdminById=async (req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await RemoveDataById(id);
        if(result){
            return res.status(200).json(result);
        }
        return res.status(400).json({message:'No data removed'});
    }
    catch(error){
        console.log(error);
    }
}

module.exports.RemoveVenueById=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await RemoveDataById(id);
        if(result){
            return res.status(200).json(result);
        }
        return res.status(400).json({message:'No data removed'});
    }catch(error){
        console.log(error);
    }
}