const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookingSchema=new Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
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
    address:{
        type:Object,
        required:true
    },
    eventId:{
        type:mongoose.SchemaType.ObjectId,
        ref:'event',
        required:true
    }
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

module.exports=mongoose.model('booking',bookingSchema);