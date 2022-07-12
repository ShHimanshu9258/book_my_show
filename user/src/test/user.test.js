const expect=require('chai').expect;
const sinon=require('sinon');
const userController=require('../controller/user-controller');
const utility=require('../utility');
const User=require('../models/user');
const axios = require('axios').default;
describe('User Controller',function(){
    describe('User controller Signin',function(){
        it('Should throw an error with code 500 if accessing the database fails',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();

            const req={
                body:{
                    email:'test@test.com',
                    password:'tester'
                }
            };
            userController.UserSignIn(req,{},()=>{}).then(result=>{
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
            userController.UserSignIn(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findOne.restore();
        })
    });
    describe('Update user-address',function(){
        it('Should throws an error if user not updated in database',function(){
            sinon.stub(User,'findById');
            User.findById.throws();
            const req={
                body:{
                    email:'test@test.com',
                    password:'tester',
                    userName:'tester',
                    state:'abc',
                    city:'xyz'
                }
             }
             userController.UpdateAddress(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findById.restore();
        });
        it('Should throws an error if user not updated in database and throw error code 422',function(){
            sinon.stub(User,'findById');
            User.findById.throws();
            const req={
                body:{
                    email:'test@test.com',
                    password:'tester',
                    userName:'tester',
                    state:'abc',
                    city:'xyz'
                }
             }
             userController.UpdateAddress(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findById.restore();
        });
    });
    describe('Create user',function(){
        it('it should through an error if user is already exist ',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();
            const req={
                body:{
                    email:'test@test.com'
                }
            }
            userController.CreteUser(req,{},()=>{}).then(result=>{
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
            userController.CreteUser(req,{},()=>{}).then(result=>{
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
            userController.CreteUser(req,{},()=>{}).then(result=>{
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
            userController.CreteUser(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.create.restore();
        })
    });  
    describe('Getting user profile',function(){
        it('it should return an error while db operation failed',function(){
            sinon.stub(User,'findById');
            User.findById.throws();
            const req={
                body:{
                    userId:12344
                }
            }
            userController.GetUserProfileById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findById.restore();
        });
        it('it should return an error while data is not fetched',function(){
            sinon.stub(User,'findById');
            User.findById.throws();
            const req={
                body:{
                    userId:12344
                }
            }
            userController.GetUserProfileById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findById.restore();
        });
    })
    describe('Getting seat availability',function(){
        it('Should throw an error if response is null',function(){
            sinon.stub(axios,'get');
            axios.get.throws();
            const req={
                body:{
                    userId:1234
                }
            }
            userController.GetSeatAvailability(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.get.restore();
        })
        it('Should throw an error if operation failed',function(){
            sinon.stub(axios,'get');
            axios.get.throws();
            const req={
                body:{
                    userId:1234
                }
            }
            userController.GetSeatAvailability(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.get.restore();
        })
    })
    describe('Getting user data by admin',function(){
        it('Should throw an error if db operation failed',function(){
            sinon.stub(User,'find');
            User.find.throws();
            const req={
                body:{
                    userId:12344
                }
            }
            userController.GettingUsersData(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.find.restore();
        })
        it('Should throw an error if no usere found',function(){
            sinon.stub(User,'find');
            User.find.throws();
            const req={
                body:{
                    userId:12344
                }
            }
            userController.GettingUsersData(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.find.restore();
        })
    })
    describe('Delete record by admin',function(){
        it('Should throw an error if db operation failed',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                body:{
                    userId:12344
                }
            }
            userController.RemoveUserFromDatabase(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findByIdAndRemove.restore();
        })
        it('Should throw an error if no usere found',function(){
            sinon.stub(User,'findByIdAndRemove');
            User.findByIdAndRemove.throws();
            const req={
                body:{
                    userId:12344
                }
            }
            userController.RemoveUserFromDatabase(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findByIdAndRemove.restore();
        })
        describe('Get Top venues',function(){
            it('Should throw an error if response is null ',function(){
                sinon.stub(axios,'get');
                axios.get.throws();
                const req={
                    body:{
                        userID:'abasbsj'
                    }
                }
                userController.GettingVenues(req,{},()=>{}).then(result=>{
                    expect(result).to.be.an('error');
                    expect(result).to.have.property('statusCode',422);
                });
                axios.get.restore();
            })
            it('Should throw an error if operation failed ',function(){
                sinon.stub(axios,'get');
                axios.get.throws();
                const req={
                    body:{
                        userID:'abasbsj'
                    }
                }
                userController.GettingVenues(req,{},()=>{}).then(result=>{
                    expect(result).to.be.an('error');
                    expect(result).to.have.property('statusCode',500);
                });
                axios.get.restore();
            })
        })
    })
    describe('Ticket Booking model',function(){
        it('Should throw an error while response is null',function(){
            sinon.stub(axios,'post');
            axios.post.throws();
            const req={
                body:{
                    venueId:123433,
                    noOfTocket:2,
                    page:1
                }
            }
            userController.TicketBooking(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.post.restore();
        })
        it('Should throw an error while Operation is failed',function(){
            sinon.stub(axios,'post');
            axios.post.throws();
            const req={
                body:{
                    venueId:123433,
                    noOfTocket:2,
                    page:1
                }
            }
            userController.TicketBooking(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.post.restore();
        })
        
    })
    describe('Cancel Ticket booking',function(){
        it('Should throw an error while response is null',function(){
            sinon.stub(axios,'post');
            axios.post.throws();
            const req={
                body:{
                    bookingId:123433,
                    noOfTocket:2,
                    page:1
                }
            }
            userController.CancelTicket(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.post.restore();
        })
        it('Should throw an error while Operation is failed',function(){
            sinon.stub(axios,'post');
            axios.post.throws();
            const req={
                body:{
                    bookingId:123433,
                    noOfTocket:2,
                    page:1
                }
            }
            userController.CancelTicket(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.post.restore();
        })
    })
    describe('Searching By Parameter',function(){
        it('Should throw an error if response is null',function(){
            sinon.stub(axios,'get');
            axios.get.throws();
            const req={
                query:{
                    searchingParmas:'params'
                }
            }
            userController.SearchingByParameter(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.get.restore();
        })
        it('Should throw an error if ',function(){
            sinon.stub(axios,'get');
            axios.get.throws();
            const req={
                query:{
                    searchingParmas:'params'
                }
            }
            userController.SearchingByParameter(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.get.restore();
        })
    })
    describe('FindByPrice - venue',function(){
        it('Should throw an error if response is null',function(){
            sinon.stub(axios,'post');
            axios.post.throws();
            const req={
                query:{
                    searchingParmas:'params'
                }
            }
            userController.FindByPrice(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            axios.post.restore();
        })
        it('Should throw an error if ',function(){
            sinon.stub(axios,'post');
            axios.post.throws();
            const req={
                query:{
                    searchingParmas:'params'
                }
            }
            userController.FindByPrice(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            axios.post.restore();
        })
    })
});