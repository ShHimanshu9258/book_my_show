const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const {admin,superAdmin,venueAdmin}=require('./roles');
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
    roles:{
        type:String,
        default:venueAdmin
    },
    address:{
        type:Object,
        required:true
    },
    serviceProvides:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'venue',
        required:true
    }],
    serviceAvailable:{
        type:mongoose.SchemaTypes.Boolean,
        default:false,
        required:true
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
