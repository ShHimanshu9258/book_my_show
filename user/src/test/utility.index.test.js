const expect=require('chai').expect;
const sinon=require('sinon');
const jwt=require('jsonwebtoken');
const utility=require('../utility');
const bcrypt=require('bcryptjs');
describe('Utility ',function(){
    describe('Validate signature',function(){
        it('Should throws an error if validateSignature failed',function(){
            const req={
                get:function(authHeader){
                    return 'Bearer xyz';
                }
            }
            sinon.stub(jwt,'verify');
            jwt.verify.returns({userId:'abc'});
            utility.ValidateSignature(req,{},()=>{});
            expect(jwt.verify.called).to.be.true;
            jwt.verify.restore();
        });
    })
    describe('Generate signature',function(){
        it('Should throw an error if generate signature failed',function(){
            sinon.stub(jwt,'sign');
            jwt.sign.throws();
            const req={
                body:{
                    payload:{
                        id:123433231,
                        email:'test@test.com'
                    }
                }
            }
            utility.GenerateSignature(req,{},()=>{});
            expect(jwt.sign.called).to.be.true;
            jwt.sign.restore();
        })
    })
    describe('Generating password',function(){
        it('Should throw an error if generating password failed',function(){
            sinon.stub(bcrypt,'hash');
            bcrypt.hash.throws();
            const req={
                body:{
                    salt:'somesalt',
                    password:'somepassword'
                }
            }
            utility.GeneratePassword(req,{},()=>{});
            expect(bcrypt.hash.called).to.be.true;
            bcrypt.hash.restore();
        })
    })
    describe('Generate salt',function(){
        it('Should throws an error if generating salt failed',function(){
            sinon.stub(bcrypt,'genSalt')
            bcrypt.genSalt.throws();
            const req={
                body:{
                    salt:'somesalt'
                }
            }
            utility.GenerateSalt(req,{},()=>{});
            expect(bcrypt.genSalt.called).to.be.true;
            bcrypt.genSalt.restore();
        })
    })
})