const joi=require('joi');

const validateUserProfile = (req,res,next)=>{
    const users=joi.object({
        name: joi.string().min(1).max(40).pattern(/^[a-zA-Z ]+$/).required(),
        phoneno: joi.number().integer().min(1000000000).max(9999999999).required().positive(),
        email: joi.string().email(),
        password: joi.string().min(5).max(20).required(),
    });
    const {error} = users.validate(req.body);
    if(error)
    {
        res.status(400).json({message: error.details[0].message});
    }
    else
    {
        next();
    }
}

module.exports={validateUserProfile}