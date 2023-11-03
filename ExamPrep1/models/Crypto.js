const mongoose = require('mongoose');
const VALIDATE_IMAGE = /^https?:\/\/.+$/;


//! is better (to don't have problems) to match model names whit create or register form name='' fields!
const cryptoSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minLength:[3, 'characters required minimum with 3 length'],
        // maxLength:[40, 'characters required maximum with 40 length'],
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
    price: {
        type: Number, 
        required: true,
    },
    description: {
        type: String, 
        required: true,
        minLength:[10, 'characters required minimum with 10 length'],
        maxLength:[200, 'characters required maximum with 200 length'],
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
    buyers: [{ // ----> logic for referencing the users buy or do staff related to this
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    //***************************************************************************************************** */
}, 
{ timestamps: true }
);


const Crypto = mongoose.model('Crypto', cryptoSchema);
module.exports = Crypto;