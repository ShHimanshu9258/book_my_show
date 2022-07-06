const dotenv=require('dotenv').config();
console.log(process.env.PORT);
module.exports={
    PORT:process.env.PORT,
    DB_URL:process.env.MONGODB_URL,
    APP_SECRET:process.env.APP_SECRET
    
}