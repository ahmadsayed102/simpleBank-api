require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const MONGODBURI = process.env.MONGODBURI
const PORT = process.env.PORT || 3000

const userAuthRoutes = require('../routes/auth/user')
const accountRoutes = require('../routes/account')


const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'Post, Get')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/auth', userAuthRoutes.routes)
app.use('/account', accountRoutes.routes)
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use((error, req, res, next) => {
    const status = error.status || 500
    const message = error.message
    const data = error.data
    res.status(status).json({message : message, data : data})
})

mongoose.connect(MONGODBURI).then(result => {
app.listen(PORT);
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
});

module.exports = app