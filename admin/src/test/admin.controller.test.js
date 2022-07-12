const expect=require('chai').expect;
const sinon=require('sinon');
const utility=require('../utility');
const User=require('../models/user');
const Event=require('../models/event');
const adminController=require('../controller/admin-controller');
const axios=require('axios').default;


describe('Admin-Controller Testing',function(){
    describe('Get Admin By Role',function(){
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(utility,'GetDataAccordingRole');
            utility.GetDataAccordingRole.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            adminController.GetAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            utility.GetDataAccordingRole.restore();
        })
        it('Should throws an error 422 if No data found',function(){
            sinon.stub(utility,'GetDataAccordingRole');
            utility.GetDataAccordingRole.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            adminController.GetAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            utility.GetDataAccordingRole.restore();
        })
    })
    describe('GetVenueAdmins-role',function(){
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(utility,'GetDataAccordingRole');
            utility.GetDataAccordingRole.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            adminController.GetVenueAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            utility.GetDataAccordingRole.restore();
        })
        it('Should throws an error 422 if No data found',function(){
            sinon.stub(utility,'GetDataAccordingRole');
            utility.GetDataAccordingRole.throws();
            const req={
                get:function(role){
                    return null;
                }
            }
            adminController.GetVenueAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            utility.GetDataAccordingRole.restore();
        })
    })
    describe('Create user',function(){
        it('it should through an error if user is already exist ',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();
            const req={
                body:{
                    email:'test@test.com'
                }
            }
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            })
            User.findOne.restore();
        })
        it('it should through an error if generating salt failed',function(){
            sinon.stub(utility,'GenerateSalt');
            utility.GenerateSalt.throws();
            const req={
                body:{
                    salt:'somesalt'
                }
            }
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
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            utility.GeneratePassword.restore();
        });
        it('it should throw an error 500 if db operation failed',function(){
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
            adminController.CreateAdmin(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.create.restore();
        })
    })
    describe('Admin controller Signin',function(){
        it('Should throw an error with code 500 if accessing the database fails',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();

            const req={
                body:{
                    email:'test@test.com',
                    password:'tester'
                }
            };
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
            adminController.UserSignIn(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findOne.restore();
        })
    });
    describe('Add Venue',function(){
        it('Should throws an error 500 if db operation fails',function(){
            sinon.stub(Event,'findOne');
            Event.findOne.throws();

            const req={
                params:{
                    userId:'123445343nd'
                }
            }
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
            adminController.AddVenueDetails(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.create.restore();
        })
    })
    describe('Remove Admin by superAdmin',function(){
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                params:{
                    userId:'12enbshdbsjwnswbwkbwkdw'
                }
            }
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
            adminController.RemoveAdminById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findByIdAndRemove.restore();

        })
    })
    describe('Remove venueAdmin by admin',function(){
        it('Should throws an error 500 if db operation failed',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                params:{
                    userId:'12enbshdbsjwnswbwkbwkdw'
                }
            }
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
            adminController.RemoveVenueById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findByIdAndRemove.restore();

        })
    })
    describe('GettingUserFromUserPortal',function(){
        it('Should Throw an error 422 if response is null ',function(){
            sinon.stub(axios,'get');
            axios.get.throws();

            const req={
                body:{
                    
                }
            }
            adminController.GettingUserFromUserPortal(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.get.restore();
        })
        it('should throw an error 500 if operation failed',function(){
            sinon.stub(axios,'get');
            axios.get.throws();
            const req={
                body:{
                    
                }
            }
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
            adminController.RemoveUserFromUserService(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.delete.restore();
        })
        it('should throw an error 500 if operation failed',function(){
            sinon.stub(axios,'delete');
            axios.delete.throws();
            const req={
                body:{
                    
                }
            }
            adminController.RemoveUserFromUserService(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.delete.restore();
        })
    })

})