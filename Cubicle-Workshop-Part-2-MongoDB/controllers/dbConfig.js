const mongoose = require('mongoose');

MONGO_DB_KEY = 'mongodb+srv://PetarMirchev:ela-da-ti-go-dam@cluster0.ejcwtc9.mongodb.net/?retryWrites=true&w=majority';


const connectDB = async () => {
    try{
        await mongoose.connect(MONGO_DB_KEY);
        console.log("MongoDB connected - acc & pass OK!");
    } catch(err){
        throw err;
    }
};


mongoose.connection.on('connection', () => {
    console.log("MongoDB connected!");
});

mongoose.connection.on('disconnect', () => {
    console.log('ERROR connect or reconnect to MongoDB!');
});

mongoose.connection.on('error', (err) => {
    logError(err);
});



module.exports = connectDB;