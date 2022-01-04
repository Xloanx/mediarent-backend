const config = require('config');
const mongoose = require('mongoose');

async function connectToMongo() {
    try{
        await mongoose.connect(`mongodb://${config.get('database.host')}/vidlydb`)
        console.log('Connected to mongodb...')
    }catch(err){
        console.error("Couldn't connect to mongodb...", err.message )
    }
}





module.exports = connectToMongo;
