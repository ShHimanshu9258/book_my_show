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
        type:mongoose.SchemaTypes.Boolean,
        default:false,
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
     
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
            delete ret.updatedAt;
            delete ret.createdAt;
        }
    },
    timestamps:true
});
module.exports=mongoose.model('event',eventSchema);
