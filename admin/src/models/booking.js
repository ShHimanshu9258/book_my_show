const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const BookingSchema=new Schema({
    userId:[{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    }],
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    noOfTickets:{
        type:Number,
        required:true
    },
    eventId:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'event',
        required:true
    }]
});
module.exports=mongoose.model('booking',BookingSchema);