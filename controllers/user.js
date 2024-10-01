const mongoose = require('mongoose')

const User = require('../models/User')
const Transaction = require('../models/Transaction');
const Account = require('../models/Account')

exports.getUser = async (req, res, next) =>{
    try {
        const id = req.userId
        const user = await User.findById(id).populate({
            path: 'accounts',
            populate: {
                path: 'transactions'
            }
        })
        if(!user){
            const error = new Error('User not found ! ')
            error.status = 401
            return next(error)
        }
        res.status(200).json(user)
    } catch (error) {
        if(!error.status)
            error.status = 500
        next(error);
    }
    
}

exports.addFavourite = async (req, res, next) =>{
    try {
        const name = req.body.name
        const accountNumber = req.body.accountNumber
        if(!name || !accountNumber){
            const error = new Error('Invalid data !')
            error.status = 422
            return next(error)
        }

        const id = req.userId
        const user = await User.findById(id)
        if(!user){
            const error = new Error('User not found !')
            error.status = 401
            return next(error)
        }

        const alreadyExist = user.favourites.some(fav => {
            return fav.name === name && fav.accountNumber === Number(accountNumber)
        })
        if(alreadyExist){
            const error = new Error(`Already exist !`);
            error.status = 409;
            return next(error);
        }
        
        const account = await Account.findOne({"accountNumber": Number(accountNumber)})
        if(!account){
            const error = new Error('No account found !')
            error.status = 404
            return next(error)
        }
        user.favourites.push({name: name, accountNumber: Number(accountNumber)})
        await user.save()
        res.status(200).json({message: 'Added successfully'})

    } catch (error) {
        if(!error.status)
            error.status = 500
        next(error);
    }
}

exports.deleteFavourite = async (req, res, next) =>{
    try {
        const name = req.body.name
        const accountNumber = req.body.accountNumber
        if(!name || !accountNumber){
            const error = new Error('Invalid data !')
            error.status = 422
            return next(error)
        }
        const id = req.userId
        const user = await User.findById(id)
        if(!user){
            const error = new Error('User not found !')
            error.status = 401
            return next(error)
        }
        const length = user.favourites.length
        const arr = user.favourites.filter(fav =>{
            return !(fav.name === name && fav.accountNumber===Number(accountNumber))
        }  
        )
        if(arr.length !== length){
            user.favourites = arr
            await user.save()
            res.status(200).json({message: 'deleted successfully'})
        }else{
            const error = new Error('favourite not found !')
            error.status = 404
            return next(error)
        }
    }catch (error) {
        if(!error.status)
            error.status = 500
        next(error);
    }
}