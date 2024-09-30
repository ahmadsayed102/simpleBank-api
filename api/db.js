const redis = require('redis')
const mongoose = require('mongoose')
const {createClient} = require('@vercel/kv');

const client  = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
});

const MONGODBURI = process.env.MONGODBURI

const MAX_RETRIES = 5
const RETRY_DELAY = 500

async function connectDb(attempt = 1){
    try{
        await mongoose.connect(MONGODBURI)
    }catch(error){
        if(attempt < MAX_RETRIES){
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
            return connectDb(attempt+1)
        }else{
            throw new Error('DB connection failed after max retries');
        }
    }
}

module.exports = {connectDb, client}