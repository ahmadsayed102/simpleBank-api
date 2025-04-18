const mongoose = require('mongoose')

const User = require('../models/User')
const Transaction = require('../models/Transaction');
const Account = require('../models/Account')

exports.getUser = async (req, res, next) => {
    try {
        const id = req.userId
        const user = await User.findById(id).populate({
            path: 'accounts',
            populate: {
                path: 'transactions'
            }
        })
        if (!user) {
            const error = new Error('User not found ! ')
            error.status = 401
            return next(error)
        }
        res.status(200).json(user)
    } catch (error) {
        next(error);
    }

}

exports.addFavourite = async (req, res, next) => {
    try {
        const name = req.body.name
        const accountNumber = req.body.accountNumber
        if (!name || !accountNumber) {
            const error = new Error('Invalid data !')
            error.status = 422
            return next(error)
        }

        const id = req.userId
        const user = await User.findById(id)
        if (!user) {
            const error = new Error('User not found !')
            error.status = 401
            return next(error)
        }

        if (user.favourites.length >= 3) {
            const err = new Error('You can only have up to 3 favourites.');
            err.status = 403;
            return next(err);
        }

        const alreadyExist = user.favourites.some(fav => {
            return fav.name === name && fav.accountNumber === Number(accountNumber)
        })
        if (alreadyExist) {
            const error = new Error(`Already exist !`);
            error.status = 409;
            return next(error);
        }

        const account = await Account.findOne({ "accountNumber": Number(accountNumber) })
        if (!account) {
            const error = new Error('No account found !')
            error.status = 404
            return next(error)
        }
        user.favourites.push({ name: name, accountNumber: Number(accountNumber) })
        await user.save()
        res.status(200).json({ message: 'Added successfully' })

    } catch (error) {
        next(error);
    }
}

exports.deleteFavourite = async (req, res, next) => {
    try {
        const name = req.body.name
        const accountNumber = req.body.accountNumber
        if (!name || !accountNumber) {
            const error = new Error('Invalid data !')
            error.status = 422
            return next(error)
        }
        const id = req.userId
        const user = await User.findById(id)
        if (!user) {
            const error = new Error('User not found !')
            error.status = 401
            return next(error)
        }
        const length = user.favourites.length
        const arr = user.favourites.filter(fav => {
            return !(fav.name === name && fav.accountNumber === Number(accountNumber))
        }
        )
        if (arr.length !== length) {
            user.favourites = arr
            await user.save()
            res.status(200).json({ message: 'deleted successfully' })
        } else {
            const error = new Error('favourite not found !')
            error.status = 404
            return next(error)
        }
    } catch (error) {
        next(error);
    }
}

exports.editFavourite = async (req, res, next) => {
    try {
        const { name, accountNumber, newName } = req.body;

        if (!name || !accountNumber || !newName) {
            const error = new Error('Invalid data! `name`, `accountNumber`, and `newName` are all required.');
            error.status = 422;
            return next(error);
        }
        const acctNum = Number(accountNumber);
        if (isNaN(acctNum)) {
            const error = new Error('Invalid data! `accountNumber` must be a number.');
            error.status = 422;
            return next(error);
        }

        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found!');
            error.status = 401;
            return next(error);
        }

        const favIndex = user.favourites.findIndex(fav =>
            fav.name === name && fav.accountNumber === acctNum
        );

        if (favIndex === -1) {
            const error = new Error('Favourite not found!');
            error.status = 404;
            return next(error);
        }

        const conflict = user.favourites.some((fav, idx) =>
            idx !== favIndex &&
            fav.name === newName
        );
        if (conflict) {
            const error = new Error('A favourite with that name already exists!');
            error.status = 409;
            return next(error);
        }

        user.favourites[favIndex].name = newName;
        await user.save();

        res.status(200).json({
            message: 'Favourite updated successfully',
            favourite: user.favourites[favIndex]
        });

    } catch (err) {
        next(err);
    }
};