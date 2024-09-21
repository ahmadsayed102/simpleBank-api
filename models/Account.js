const mongoose = require('mongoose')
const schema = mongoose.Schema

const autoIncrement = require('mongoose-sequence')(mongoose)

const accountSchema = new schema({
    accountNumber: {
        type: Number,
        unique: true
    },
    accountType : {
        type : String,
        required : true,
        enum : ['SAVINGS', 'DEBIT']
    },
    balance : {
        type : Number,
        default : 0
    },
    currency : {
        type : String,
        default : "EGP"
    },
    active : {
        type : Boolean,
        default : true
    },
    transactions : [{
        type : mongoose.Types.ObjectId,
        ref : 'Transaction',
        default : []
    }]
},
    {
        timestamps : true
    }
)

accountSchema.plugin(autoIncrement, { model: 'Account', inc_field: 'accountNumber'});

module.exports = mongoose.model('Account',  accountSchema)