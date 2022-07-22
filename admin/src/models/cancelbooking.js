const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const cancelSchema=new Schema({
    userId:[{
        type:mongoose.SchemaTypes.ObjectId,
        required:true
    }],
    address:{
        type:Object,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    noOfTickets:{
        type:Number,
        required:true
    },
    events:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'event',
        required:true
    }],
    cancelBookingStatus:{
        type:mongoose.SchemaTypes.Boolean,
        default:true
    }

});
module.exports=mongoose.model('cancel_booking',cancelSchema);