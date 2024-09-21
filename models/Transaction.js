const mongoose = require('mongoose')
const schema = mongoose.Schema

const transactionSchema = new schema({
    senderAccount : {
        type : Number,
        ref : 'Account',
        required : true
    },
    recipientAccount : {
        type : Number,
        ref : 'Account',
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    success : {
        type : Boolean
    },
    currency : {
        type : String,
        default : "EGP"
    }
},
    {
        timestamps :{createdAt:true}
    }
)

module.exports = mongoose.model('Transaction', transactionSchema)