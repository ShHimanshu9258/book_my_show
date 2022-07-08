const User=require('../models/user');
const Event=require('../models/event');
const Address=require('../models/address');
const {admin,superAdmin,venueAdmin}=require('../models/roles');
const { GenerateSalt, GeneratePassword ,ValidatePassword,GenerateSignature,GetDataAccordingRole,GetDataByEmail, GetDataById, RemoveDataById} = require('../utility');



module.exports.GetAdmin=async (req,res,next)=>{
    try{
        const adminResult=await GetDataAccordingRole('admin');
        if(!adminResult){
            const error=new Error('No Data found');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(adminResult);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
};

module.exports.CreateAdmin=async (req,res,next)=>{
    try{
        const {email,password,address,name,phone}= req.body;
        const existingUser=await GetDataByEmail(email,User);
        if(existingUser){
            const error=new Error('User is alerdy registerd');
            error.statusCode=422;
            throw error;          
        }
        const salt=await GenerateSalt();
            const userPassword=await GeneratePassword(password,salt);
            const user=new User({
                email:email,
                phone:phone,
                address:address,
                name:name,
                password:userPassword,
                salt:salt,
                roles:venueAdmin
            });
            const result=await user.save();
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

module.exports.UserSignIn=async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await GetDataByEmail(email,User);
        if(!user){
            const error=new Error('User not find with this email');
            error.statusCode=422;
            throw error;
        }
        const validPassword= await ValidatePassword(password,user.password,user.salt);
        if(!validPassword){
            const error=new Error('User password is not matched with saved password');
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

module.exports.GetVenueAdmin=async(req,res,next)=>{
    try{
        const venueResult=await GetDataAccordingRole('venueadmin'); 
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

module.exports.UpdateVenueLocation=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const {city,state,pincode,country,landmark}=req.body;
        const event=await GetDataById(id,Event);
        if(!event){
            const error=new Error('No venue available with this id...');
            error.statusCode=422;
            throw error; 
        }
        const address=new Address({
            city:city,
            state:state,
            country:country,
            pincode:pincode,
            landmark:landmark
        });
        const result=await address.save();
        if(!result){
            const error=new Error('No Location updtaed please try again');
            error.statusCode=422;
            throw error;
        }
        event.venueLocation.push(result);
        const venueResult=await event.save();
        if(!venueResult){
            const error=new Error(' No Event updated ...');
            error.statusCode=422;
            throw error;
        }
        return res.status(201).json(venueResult);
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}


module.exports.AddVenueDetails=async(req,res,next)=>{
    try{
        const {venueType,registrationId,event,timing,totalSeats,remaningAvailableSeats,ratings}=req.body;
        const existingVenue=await Event.findOne({registrationId:registrationId});
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
            postponeEvent:[],
            venueLocation:[],
            ratings:ratings
        });
        const result=await venue.save();
        if(!result){
            const error=new Error('Event not cretaed please try again');
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

// module.exports.AddEvent=async(req,res,next)=>{
//     try{
//         const id=req.params.id;
//         const {event,imdbId,totalSeats,remaningAvailableSeats,ratings}=req.body;
//         const venue=await GetDataById(id,Venue);
//         const existingEvent=await Event.findOne({imdbId:imdbId});
//         if(venue!==null && existingEvent===null){
//             const eventModel=new Event({
//                 event:event,
//                 imdbId:imdbId,
//                 totalSeats:totalSeats,
//                 remaningAvailableSeats:remaningAvailableSeats,
//                 ratings:ratings
//             });
//             const eventResult=await eventModel.save();
//             if(eventResult){
//                 venue.event.push(eventResult);
//                 const venueResult=await venue.save();
//                 if(venueResult){
//                     return res.status(201).json(venueResult);
//                 }
//                 return res.json({message:'OOPS!! Venue table not updated...'});
//             }
//             return res.json({message:'No Data inserted into event table'});
//         }
//         return res.json({message:'Event is already generated with this id...'});
//     }
//     catch(error){
//         console.log(error);
//     }
// }

module.exports.RemoveAdminById=async (req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await RemoveDataById(id,User);
        if(!result){
            const error=new Error('No data removed');
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

module.exports.RemoveVenueById=async(req,res,next)=>{
    try{
        const id=req.params.id;
        const result=await RemoveDataById(id,Venue);
        if(!result){
            const error=new Error('No data removed');
            error.statusCode=422;
            throw error;
        }
        return res.status(200).json(result);
    }catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
}
