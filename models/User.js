const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    country : {
        type : String,
        default : 'Egypt'
    },
    dateOfBirth : {
        type : schema.Types.Date,
        required : true
    },
    accounts : [{
        type : schema.Types.ObjectId,
        ref : 'Account',
        default : []
    }],
    favourites : [{
        name : {type: String, required: true},
        accountNumber:{type: Number, required: true, unique: true}
    }] 
    
},
    {
        timestamps : true
    }
)

module.exports = mongoose.model('User', userSchema)