const { ValidateSignature } = require('../utility');

module.exports = async (req,res,next) => {
    try{
        const isAuthorized = await ValidateSignature(req);
        if(!isAuthorized){ 
            const error=new Error('Not Authorized');
            error.statusCode=403;
            throw error;
        }
        req.user=isAuthorized;
        return next();
    }
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
    
}