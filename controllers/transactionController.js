const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User')

exports.transaction = async (req, res, next) => {
    let log = true
    const sess = await mongoose.startSession();
    try {
        const { fromAcct, toAcct, amount } = req.body;
        const id = req.userId
        const user = await User.findById(id).populate('accounts')
        if (!user) {
            const error = new Error('No User found');
            error.status = 404;
            return next(error);
        }
        const hisAccount = user.accounts.some(account => account.accountNumber === fromAcct)
        if (!hisAccount) {
            const error = new Error(`Invalid transaction`);
            error.status = 401;
            return next(error);
        }

        await sess.withTransaction(async () => {
            const sender = await Account.findOne({ accountNumber: fromAcct })
                .session(sess);
            if (!sender || !sender.active) {
                const err = new Error('Invalid or inactive sender account');
                err.status = 404;
                throw err;
            }

            const recipient = await Account.findOne({ accountNumber: toAcct })
                .session(sess);
            if (!recipient || !recipient.active) {
                const err = new Error('Invalid or inactive recipient account');
                err.status = 404;
                throw err;
            }

            if (sender.balance < amount) {
                log = false
                const err = new Error('Insufficient funds');
                err.status = 400;
                throw err;
            }

            sender.balance -= amount;
            recipient.balance += amount;
            await sender.save({ session: sess });
            await recipient.save({ session: sess });

            const txn = await Transaction.create([{
                senderAccount: fromAcct,
                recipientAccount: toAcct,
                amount,
                success: true
            }], { session: sess });

            sender.transactions.push(txn[0]._id);
            recipient.transactions.push(txn[0]._id);
            await sender.save({ session: sess });
            await recipient.save({ session: sess });
        });

        sess.endSession();
        return res.status(200).json({ message: 'Transfer successful' });
    } catch (err) {
        //await sess.abortTransaction(); 
        sess.endSession();
        if (log)
            await Transaction.create({
                senderAccount: req.body.fromAcct,
                recipientAccount: req.body.toAcct,
                amount: req.body.amount,
                success: false
            });
        return next(err);
    }
};

exports.updateBalance = async (req, res, next) => {
    try {
        const { accountNum, amount } = req.body
        const id = req.userId

        const user = await User.findById(id).populate('accounts')
        if (!user) {
            const error = new Error('No user found')
            error.status = 404
            throw error
        }
        const sameAccount = user.accounts.some(account => account.accountNumber = accountNum)
        if (!sameAccount) {
            const error = new Error("Can't update this account")
            error.status = 401
            throw error

        }
        const updatedAccount = await Account.findOne({ accountNumber: accountNum })
        console.log(updatedAccount);
        if (!updatedAccount || !updatedAccount.active) {
            const error = new Error("Invalid or inactive account")
            error.status = 403
            throw error
        }
        if (amount < 0 && updatedAccount.balance < amount) {
            const error = new Error('Insufficent balance')
            error.status = 400
            throw error
        }
        updatedAccount.balance += amount
        await updatedAccount.save()
        return res.status(200).json({ message: 'Balance is updated' });
    } catch (error) {

        return next(error)
    }
}
