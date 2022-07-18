const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:[{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'address',
        required:true
    }],
    otp: {
        type: Number
    },
    otp_expiry: {
        type: Date
    },
    verified:{
        type:Boolean,
        default:false
    }
},
    {
        toJSON:{
            transform(doc,ret){
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.updatedAt;
                delete ret.createdAt;
            }
        },
        timestamps:true
    }
);
module.exports=mongoose.model('user',userSchema);
