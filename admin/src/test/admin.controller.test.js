// basic testing packages 
const expect=require('chai').expect;
const sinon=require('sinon');
// importing utility folder
const utility=require('../utility');
// importing models
const User=require('../models/user');
const Event=require('../models/event');
// importing admin controller for calling adminController methods
const adminController=require('../controller/admin-controller');
// importing axios 
const axios=require('axios').default;

// importing mongoose
const mongoose=require('mongoose');

// importing dotenv for getting enviroment variables
const dotenv=require('dotenv').config();

// declaring global variables
const TEST_DB_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qnaxe.mongodb.net/${process.env.MONGO_TEST_DB}`;



describe('Admin-Controller Testing',function(){
    // testing adminController method getDataByAdmin
    describe('Get Admin By Role',function(){
        it('Should throws an error 500 if db operation failed',function(){
            // this function is used for calling methods
            // it will take 2 parameters 1 .functionClass and 2. Methods or function name
            sinon.stub(User,'find');
            // throws error for particular method
            User.find.throws();
            // requesting method vaue
            const req={
                get:function(role){
                    return null;
                }
            }
            // calling adminController method
            adminController.GetAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            // restoring the value
            User.find.restore();
        })
        // if error is 422 means if data not found
        it('Should throws an error 422 if No data found',function(){
            sinon.stub(User,'find');
            User.find.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            adminController.GetAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.find.restore();
        })
    })
    describe('GetVenueAdmins-role',function(){
        // if db operation failed
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(User,'find');
            User.find.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            // calling controller method
            adminController.GetVenueAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.find.restore();
        })
        // if data not found
        it('Should throws an error 422 if No data found',function(){
            sinon.stub(User,'find');
            User.find.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            adminController.GetVenueAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.find.restore();
        })
    })
    describe('Create user',function(){
        before(function (done) {
            mongoose
                .connect(TEST_DB_URI)
                .then(() => {
                    const restaurant = new User({
                        email:'test@test.com',
                        phone:'1234567890',
                        address:'[]',
                        name:'test',  
                        password:'test123',
                        salt:'test123'
                    })
                    return restaurant.save();
                })
            done()
        })
         // if db operation failed
         it('it should through an error if user is already exist ',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();
            const req={
                body:{
                    email:'test@test.com'
                }
            }
            // calling controller method
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            })
            User.findOne.restore();
        })
         // ifsalt is not generated
        it('it should through an error if generating salt failed',function(){
            sinon.stub(utility,'GenerateSalt');
            utility.GenerateSalt.throws();
            const req={
                body:{
                    salt:'somesalt'
                }
            }
            // calling controller method
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            utility.GenerateSalt.restore();
        });
        it('it should through an error if generating password failed',function(){
            sinon.stub(utility,'GeneratePassword');
            utility.GeneratePassword.throws();
            const req={
                body:{
                    password:'test123'
                }
            }
            // calling controller method
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            utility.GeneratePassword.restore();
        });
        it('it should throw an error 500 if db operation failed',function(){
            // if db operation failed
            sinon.stub(User,'create');
            User.create.throws();
            const req={
                body:{
                    email:'test@test.com',
                    phone:'1234567890',
                    address:'[]',
                    name:'test',  
                    password:'test123',
                    salt:'test123'
                }
            }
            // calling controller method
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.create.restore();
        })
        after(function (done) {
            User.deleteMany({})
                .then(() => {
                    return mongoose.disconnect();
                })
                .then(() => {
                    done();
                });
        });

        
    })
    describe('Admin controller Signin',function(){
        // if db operation failed
        it('Should throw an error with code 500 if accessing the database fails',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();

            const req={
                body:{
                    email:'test@test.com',
                    password:'tester'
                }
            };
            // calling controller method
            adminController.UserSignIn(req,{},()=>{}).then(result=>{
                // console.log(result);
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findOne.restore();
        });
        it('Should through an error code422 if user is not found or password is not valid',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();
            const req={
                body:{
                    email:'test@test.com',
                    password:'tester',
                }
            };
            // calling controller method
            adminController.UserSignIn(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findOne.restore();
        })
    });
    describe('Add Venue',function(){
        before(function (done) {
            mongoose
                .connect(TEST_DB_URI)
                .then(() => {
                    const restaurant = new Event({
                    event:'someevent',
                    venueType:'testvenue',
                    registrationId:'12345njdbvdjdbnjnjds2',
                    timing:'22-04-30',
                    totalSeats:'150',
                    remaningAvailableSeats:'150',
                    ticketPrice:'someticket',
                    postponeEvent:'[]',
                    venueLocation:'address',
                    ratings:'ratings',
                    })
                    return restaurant.save();
                })
            done()
        })
        // if db operation failed
        it('Should throws an error 500 if db operation fails',function(){
            sinon.stub(Event,'findOne');
            Event.findOne.throws();

            const req={
                params:{
                    userId:'123445343nd'
                }
            }
            // calling controller method
            adminController.AddVenueDetails(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.findOne.restore();
        })
        it('Should throws an error statuscode 422 ',function(){
            sinon.stub(Event,'create');
            Event.create.throws();
            const req={
                body:{
                    event:'someevent',
                    venueType:'testvenue',
                    registrationId:'12345njdbvdjdbnjnjds2',
                    timing:'22-04-30',
                    totalSeats:'150',
                    remaningAvailableSeats:'150',
                    ticketPrice:'someticket',
                    postponeEvent:'[]',
                    venueLocation:'address',
                    ratings:'ratings',
                }
            }
            // calling controller method
            adminController.AddVenueDetails(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.create.restore();
        })
        after(function (done) {
            Event.deleteMany({})
                .then(() => {
                    return mongoose.disconnect();
                })
                .then(() => {
                    done();
                });
                done();
        });
    })
    describe('Remove Admin by superAdmin',function(){
        // if db operation failed
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                params:{
                    userId:'12enbshdbsjwnswbwkbwkdw'
                }
            }
            // calling controller method
            adminController.RemoveAdminById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findByIdAndRemove.restore();

        })
        it('Should throws an error 422 if no user find',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                params:{
                    userId:'12enbshdbsjwnswbwkbwkdw'
                }
            }
            // calling controller method
            adminController.RemoveAdminById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findByIdAndRemove.restore();

        })
    })
    describe('Remove venueAdmin by admin',function(){
        // if db operation failed
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                params:{
                    userId:'12enbshdbsjwnswbwkbwkdw'
                }
            }
            // calling controller method
            adminController.RemoveVenueById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findByIdAndRemove.restore();

        })
        it('Should throws an error 422 if no user find',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                params:{
                    userId:'12enbshdbsjwnswbwkbwkdw'
                }
            }
            // calling controller method
            adminController.RemoveVenueById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findByIdAndRemove.restore();

        })
    })
    describe('GettingUserFromUserPortal',function(){
        it('Should Throw an error 422 if response is null ',function(done){
            sinon.stub(axios,'get');
            axios.get.throws();

            const req={
                body:{
                    
                }
            }
            // calling controller method
            adminController.GettingUserFromUserPortal(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
                done();
            });
            done();
            axios.get.restore();
        }) // if db operation failed
        it('should throw an error 500 if operation failed',function(){
            sinon.stub(axios,'get');
            axios.get.throws();
            const req={
                body:{
                    
                }
            }
            // calling controller method
            adminController.GettingUserFromUserPortal(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.get.restore();
        })
    })
    describe('Removing user from user portal',function(){
        it('Should Throw an error 422 if response is null ',function(){
            sinon.stub(axios,'delete');
            axios.delete.throws();

            const req={
                body:{
                    
                }
            }
            // calling controller method
            adminController.RemoveUserFromUserService(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.delete.restore();
        })
        // if db operation failed
        it('should throw an error 500 if operation failed',function(){
            sinon.stub(axios,'delete');
            axios.delete.throws();
            const req={
                body:{
                    
                }
            }
            // calling controller method
            adminController.RemoveUserFromUserService(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.delete.restore();
        })
    })

})