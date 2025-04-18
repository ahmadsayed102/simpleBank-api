const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.transfer = async (req, res, next) => {
    const { fromAcct, toAcct, amount } = req.body;
    const sess = await mongoose.startSession();

    try {
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
        await sess.abortTransaction();
        sess.endSession();

        await Transaction.create({
            senderAccount: req.body.fromAcct,
            recipientAccount: req.body.toAcct,
            amount: req.body.amount,
            success: false
        });
        return next(err);
    }
};
