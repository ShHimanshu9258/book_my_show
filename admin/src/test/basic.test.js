const expect=require('chai').expect;

describe('starting testing',function(){
    it('should two number added correctly',function(){
        const num1 =2;
        const num2=3;
        expect(num1+num2).to.equal(5);
    });
    it('should not give a result of 6',function(){
        const num1 =2;
        const num2=3;
        expect(num1+num2).not.to.equal(6);
    });
});
