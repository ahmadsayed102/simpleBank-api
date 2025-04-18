const jwt = require('jsonwebtoken')
// commented is redis
// const { client } = require('../api/db') 

module.exports = async (req, res, next) => {
    try {
        const header = req.get('Authorization')
        if (!header) {
            const error = new Error('Not authienticated')
            error.status = 401
            next(error)
        }
        const token = header.split(' ')[1]
        let decodedToken
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        // const result = await client.get(token)
        // if (result === 'blackListed') {
        //     return res.status(401).json({ message: 'Token has been invalidated' });
        // }
        req.token = token
        req.userId = decodedToken.id
        next()
    } catch (error) {
        error.message = 'Not authienticated '
        error.status = 401
        next(error)
    }

}