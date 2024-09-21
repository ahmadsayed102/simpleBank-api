const User = require('../models/User')
const Transaction = require('../models/Transaction');

exports.getUser = async (req, res, next) =>{
    try {
        const id = req.userId
        const user = await User.findById(id).populate({
            path: 'accounts',
            populate: {
                path: 'transactions'
            }
        })
        if(!user){
            const error = new Error('User not found ! ')
            error.status = 401
            return next(error)
        }
        res.status(200).json({user})
    } catch (error) {
        if(!error.status)
            error.status = 500
        next(error);
    }
    
}