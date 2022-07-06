const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const eventSchema=new Schema({
    event:{
        type:String,
        required:true
    },
    imdbId:{
        type:Number,
        required:true,
        unique:true
    },
    seatAvailability:{
        type:Boolean,
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
     ratings:{
         type:Number,
         required:true
     }
},{
    timestamps:true
});

module.exports=mongoose.model('event',eventSchema);