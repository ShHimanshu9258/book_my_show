// importing reusable service
const { ValidateSignature } = require('../utility');
// checking user is authorized or not

/**
 * checking user is authorized or not
 * @param {req} req 
 * @param {res} res 
 * @param {next} next 
 * @returns 
 */
module.exports = async (req,res,next) => {
    
    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){ 
        req.user=isAuthorized;
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}