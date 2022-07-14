// importing reusable function from utility
const { ValidateSignature } = require('../utility');

/**
 * authenticating user is valid or not
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns 
 */
module.exports = async (req,res,next) => {
    try{
        // validating signature 
        const isAuthorized = await ValidateSignature(req);
        // if user is not authorized then throws error
        if(!isAuthorized){ 
            const error=new Error('Not Authorized');
            error.statusCode=403;
            throw error;
        }
        req.user=isAuthorized;
        return next();
    }
    // handling errors
    catch(error){
        if(!error.statusCode){
            error.statusCode=500;
        }
        next(error);
    }
    
}