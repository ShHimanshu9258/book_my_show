const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const addressSchema=new Schema({
    city:String,
    pincode:Number,
    state:String,
    country:String,
    landmark:String
});
module.exports=mongoose.model('address',addressSchema);