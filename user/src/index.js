const express=require('express');
const app=express();
const UserRoutes=require('./routes/user-routes');

app.use(UserRoutes);

app.listen(4000);