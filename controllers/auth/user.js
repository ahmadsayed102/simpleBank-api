const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const {client} = require('../../api/db')

const User = require('../../models/User')


exports.register = async (req, res, next) => {
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

exports.logout = async (req, res, next) => {
    try{
        const decodedtoken = jwt.decode(req.token) 
        const expiry = decodedtoken.exp - Math.floor(Date.now()/1000)
        //console.log( typeof req.token, req.token);
        await client.set(req.token,'blackListed', {ex:expiry} )
        // console.log(await client.get(req.token));
        res.status(200).json({ message: 'Logged out successfully' });
    }catch(error){
        console.log("from here");
    }
    
    
}

exports.test = (req, res) =>{
    res.json({"message" : "new liiiiiih"})
}

