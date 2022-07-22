const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const addressSchema=new Schema({
    city:String,
    pincode:String,
    state:String,
    country:String,
    streetName:String,
    countryCode:String
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
module.exports=mongoose.model('address',addressSchema);