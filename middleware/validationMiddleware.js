const { validationResult } = require('express-validator')
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.status = 422
        error.data = errors.array()
        return next(error)
    }
    next()
}