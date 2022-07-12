const expect=require('chai').expect;
const sinon=require('sinon');
const userController=require('../controller/user-controller');
const utility=require('../utility');
describe('User Controller',function(){
    describe('User controller Signin',function(){
        it('Should throw an error with code 500 if accessing the database fails',function(){
            sinon.stub(utility,'GetDataByEmail');
            utility.GetDataByEmail.throws();

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
            utility.GetDataByEmail.restore();
        });
        it('Should through an error code422 if user is not found or password is not valid',function(){
            sinon.stub(utility,'GetDataByEmail');
            utility.GetDataByEmail.throws();
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
            utility.GetDataByEmail.restore();
        })
    });
    
})