const express=require('express');
const bodyParser=require('body-parser');
const app=express();

// importing routes
const UserRoutes=require('./routes/user-routes');

// allow accepting data from postman
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// using routes
app.use(UserRoutes);

app.listen(4000);