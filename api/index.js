require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const {connectDb} = require('./db')


const PORT = process.env.PORT || 3000

const userAuthRoutes = require('../routes/auth/user')
const accountRoutes = require('../routes/account')
const userRoutes = require('../routes/user')
const transactionRoutes = require('../routes/transaction')


app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'Post, Get')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/auth', userAuthRoutes.routes)
app.use('/account', accountRoutes.routes)
app.use('/user', userRoutes.routes)
app.use('/transactions', transactionRoutes.routes)
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message
    const data = error.data
    res.status(status).json({message : message, data : data})
})


async function startApp() {
    try{
        await connectDb()
        app.listen(PORT)
    }catch(error){
        console.log(error);
    }
}
startApp()

module.exports = app