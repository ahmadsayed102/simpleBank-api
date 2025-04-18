const mongoose = require('mongoose');
const { Schema } = mongoose;

const favouriteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    }
}, { _id: false });

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Egypt'
    },
    dateOfBirth: {
        type: Schema.Types.Date,
        required: true
    },
    accounts: [{
        type: Schema.Types.ObjectId,
        ref: 'Account',
        default: []
    }],
    favourites: {
        type: [favouriteSchema],
        default: [],
        validate: {
            validator: function (arr) {
                return arr.length <= 3;
            },
            message: props => `Too many favourites (${props.value.length}). Maximum allowed is 3.`
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
