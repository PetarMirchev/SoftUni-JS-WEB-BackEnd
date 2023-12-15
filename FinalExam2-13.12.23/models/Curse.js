const mongoose = require('mongoose');
const VALIDATE_IMAGE = /^https?:\/\/.+$/;


//! is better (to don't have problems) to match model names whit create or register form name='' fields!
const curseSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        minLength:[3, 'characters required minimum with 3 length'],
    },
    image: {
        type: String, 
        required: true,
        validate: {
            validator(value) {
                return VALIDATE_IMAGE.test(value);
            },
            message: 'The photo image should start with http:// or https://',
        }
    },
    description: {
        type: String, 
        required: true,
        minLength:[10, 'characters required minimum with 10 length'],
    },
    type: {
        type: String, 
        required: true,
        minLength:[3, 'characters required minimum with 10 length'],
    },
    certificate: {
        type: String, 
        required: true,
        minLength:[2, 'characters required minimum with 10 length'],
    },
    price: {
        type: Number, 
        required: true,
        min: [0, 'The price should be a positive number.'],
    },
    
    payment: { //Payment Method: String (crypto-wallet, credit-card, debit-card, paypal) required,
        type: String,
        enum: {
            values: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal'], //strings put hear ar only available options for this!
            message: 'invalid payment method',
        },
        require: true,
    },
    owner: { //Owner - object Id (a reference to the User model)
        type: mongoose.Types.ObjectId,
        ref: 'User', // reference to the User model (1 owner - many cryptos)
    },
    //***************************************************************************************************** */
    //actions related to the product/item interaction
    signUpList: [{ // buyers ----> logic for referencing the users buy or do staff related to this
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    //***************************************************************************************************** */
}, 
{ timestamps: true }
);


const Curse = mongoose.model('Crypto', curseSchema);
module.exports = Curse;