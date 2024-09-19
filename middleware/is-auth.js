const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const header = req.get('authorization')
    if(!header){
        const error = new Error('Not authienticated')
        error.status = 401
        throw error
    }
    const token = header.spilt(' ')[1]
    let decodedToken 
    try {
        decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
    } catch (error) {
        error.status = 500
        throw error
    }
    if(!decodedToken){
        const error = new Error('Not authienticated')
        error.status = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}