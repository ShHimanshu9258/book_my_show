const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const venueSchema=new Schema({
    venueType:{
        type:String,
        required:true
    },
    registrationId:{
        type:Number,
        required:true,
        unique:true
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
    venueLocation:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'address',
        required:true
    }],
    event:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'event',
        required:true
    }]
});

module.exports=mongoose.model('venue',venueSchema);
