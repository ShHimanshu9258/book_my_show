const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const eventSchema=new Schema({
    event:{
        type:String,
        required:true
    },
    venueType:{
        type:String,
        required:true
    },
    seatAvailability:{
        type:mongoose.SchemaTypes.Boolean,
        default:true,
        required:true 
     },
     totalSeats:{
         type:Number,
         required:true
     },
     remaningAvailableSeats:{
         type:Number,
         required:true
     },
     timing:{
        type:Object,
        required:true
     },
     cancelEvent:{
        type:mongoose.SchemaTypes.Boolean,
        default:false
     },
     postponeEvent:[{
        type:Date
     }],
     ratings:{
         type:Number,
         required:true
     },
     ticketPrice:{
        type:Number,
        required:true
     },
     registrationId:{
        type:Number,
        required:true,
        unique:true
    },
    venueLocation:{
        type:Object,
        required:true
    }
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
            delete ret.updatedAt;
            delete ret.createdAt;
            delete ret.cancelBooking;
            delete ret.bookingEvent;
        }
    },
    timestamps:true
});
module.exports=mongoose.model('event',eventSchema);
