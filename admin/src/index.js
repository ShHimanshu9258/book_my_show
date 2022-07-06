const express=require('express');
const AdminRoutes=require('./routes/admin-routes');
const app=express();
app.use(AdminRoutes);
app.listen(3000,()=>{
    console.log(`app listen to 3000  port`);
})
.on('error', (err) => {
    console.log(err);
    process.exit();
});