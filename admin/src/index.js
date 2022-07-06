const express=require('express');
const bodyParser=require('body-parser');

// importing routes
const AdminRoutes=require('./routes/admin-routes');
const { PORT } = require('./config');
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(AdminRoutes);
app.listen(PORT,()=>{
    console.log(`app listen to 3000  port`);
})
.on('error', (err) => {
    console.log(err);
    process.exit();
});