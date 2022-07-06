const { ValidateSignature } = require('../utility');

module.exports = async (req,res,next) => {
    
    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized!==null){ 
        req.user=isAuthorized;
        return next();
    }
    return res.status(403).json({message: 'Not Authorized'})
}