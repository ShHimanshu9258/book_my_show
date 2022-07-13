const expect=require('chai').expect;
const sinon=require('sinon');
const axios=require('axios').default;
const User=require('../models/user');
const Event=require('../models/event');
const venueAdminController=require('../controller/venue-controller');

describe('Venue-Admin controller',function(){
    describe('Vender signin',function(){
        it('Should throw an error with code 500 if accessing the database fails',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();

            const req={
                body:{
                    email:'test@test.com',
                    password:'tester'
                }
            };
            venueAdminController.VenderSignIn(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findOne.restore();
        });
        it('Should through an error code 422 if user is not found or password is not valid',function(){
            sinon.stub(User,'findOne');
            User.findOne.throws();
            const req={
                body:{
                    email:'test@test.com',
                    password:'tester',
                }
            };
            venueAdminController.VenderSignIn(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findOne.restore();
        })
    })
    describe('GetVenueAdminProfileById',function(){
        it('Should through an error code 500 if db operation failed...',function(){
            sinon.stub(User,'findById');
            User.findById.throws();
            const req={
                params:{
                    userId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.GetVenueAdminProfileById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            User.findById.restore();
        })
        it('Should through an error code 422 if no user found...',function(){
            sinon.stub(User,'findById');
            User.findById.throws();
            const req={
                params:{
                    userId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.GetVenueAdminProfileById(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            User.findById.restore();
        })
    })

    describe('UpdateEventTiming',function(){
        it('Should through an error code 500 if db operation failed...',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();
            const req={
                params:{
                    userId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.UpdateEventTiming(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.findById.restore();
        })
        it('Should through an error code 422 if no Event found...',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();
            const req={
                params:{
                    userId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.UpdateEventTiming(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            Event.findById.restore();
        })
    })
    describe('Cancel Event',function(){
        it('Should through an error code 500 if db operation failed...',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();
            const req={
                params:{
                    userId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.CancelEvent(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.findById.restore();
        })
        it('Should through an error code 422 if no Event found...',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();
            const req={
                params:{
                    userId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.CancelEvent(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            Event.findById.restore();
        })
    })
    describe('Postpne Event',function(){
        it('Should through an error code 500 if db operation failed...',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();
            const req={
                params:{
                    eventId:'12endswnsdhdshsj2332'
                },
                body:{
                    time:'[]'
                }
            }
            venueAdminController.PostponeEvent(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.findById.restore();
        })
        it('Should through an error code 422 if no Event found...',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();
            const req={
                params:{
                    eventId:'12endswnsdhdshsj2332',
                },
                body:{
                    time:'[]'
                }
            }
            venueAdminController.PostponeEvent(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            Event.findById.restore();
        })
    })
    describe('UpdateEventseats',function(){
        it('Should throw an error code 500 if db operation failed',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();

            const req={
                params:{
                    eventId:'12endswnsdhdshsj2332'
                },
                body:{
                    noOfTickets:2,
                    venueId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.UpdateEventseats(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.findById.restore();
        })
        it('Should throw an error code 422 if no record found',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();

            const req={
                params:{
                    eventId:'12endswnsdhdshsj2332'
                },
                body:{
                    noOfTickets:2,
                    venueId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.UpdateEventseats(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            Event.findById.restore();
        })
    })
    describe('GettingSeatAvailability',function(){
        it('Should throw an error code 500 if db operation failed',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();

            const req={
                params:{
                    eventId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.GettingSeatAvailability(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',500);
            });
            Event.findById.restore();
        })
        it('Should throw an error code 422 if no record found',function(){
            sinon.stub(Event,'findById');
            Event.findById.throws();

            const req={
                params:{
                    eventId:'12endswnsdhdshsj2332'
                }
            }
            venueAdminController.GettingSeatAvailability(req,{},()=>{}).then(result=>{
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode',422);
            });
            Event.findById.restore();
        })
    })
})