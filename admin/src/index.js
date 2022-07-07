const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const dotenv=require('dotenv').config();
// importing routes
const AdminRoutes=require('./routes/admin-routes');
const VenueAdminRoutes=require('./routes/venue-routes');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// global variables decleration
const PORT=`${process.env.PORT}`
const MONGODB_URI =
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qnaxe.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;


app.use(AdminRoutes);
app.use(VenueAdminRoutes);


// handling global errors
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
       message: message,
      data: data,
    status:status
   });
  });

 mongoose.connect(MONGODB_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log('connected to db');
        console.log(`app listen to ${PORT}  port`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    });
 }).catch(err=>{
    console.log(err);
 })

