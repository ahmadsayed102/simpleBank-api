const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const header = req.get('Authorization')
    if(!header){
        const error = new Error('Not authienticated')
        error.status = 401
        throw error
    }
    const token = header.split(' ')[1]
    let decodedToken 
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        error.message = 'Not authienticated'
        error.status = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}