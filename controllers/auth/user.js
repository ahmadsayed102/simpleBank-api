const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../../models/User')

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.status = 422
        error.data = errors.array()
        return next(error)
    }
    const {name, email, password, country, dateOfBirth} = req.body
    
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const error = new Error('User already exists');
            error.status = 409;
            return next(error);
        }
        const hashed = await bcrypt.hash(password, 12)
        const newUser = new User({
            name : name,
            email : email,
            password : hashed,
            country : country,
            dateOfBirth : dateOfBirth
        })
        const result = await newUser.save()
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        if(!err.status)
            err.status = 500
        next(err); 
    }
    
}


exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.status = 422
        error.data = errors.array()
        return next(error)
    }
    const email = req.body.email
    const password = req.body.password
    try{
    const user = await User.findOne({email : email})
    if(!user){
        const error = new Error('Invalid email or password ! ')
        error.status = 401
        return next(error)
    }

    const passwordEqual = await bcrypt.compare(password, user.password)
    if(!passwordEqual){
        const error = new Error('Invalid email or password ! ')
        error.status = 401
        return next(error)
    }

    const token = jwt.sign({email: user.email,
        id : user._id.toString()
    }, process.env.JWT_SECRET,
    {expiresIn : '2h'}, )

    return res.status(200).json({
        message : 'Login success',
        token : token,
        userId : user._id.toString()
    })
    }catch (error) {
    if(!error.status)
        error.status = 500
    next(error); 
    }
}

exports.test = (req, res) =>{
    res.json({"message" : "new liiiiiih"})
}

