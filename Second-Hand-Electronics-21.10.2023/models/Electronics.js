const mongoose = require('mongoose');
const VALIDATE_IMAGE = /^https?:\/\/.+$/;

let electronicsSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minLength:[10, 'characters required minimum with 10 length'],
        // maxLength:[40, 'characters required maximum with 40 length'],
    },
    type: {
        type: String, 
        required: true,
        minLength:[2, 'characters required minimum with 2 length'],
        // maxLength:[40, 'characters required maximum with 40 length'],
    },
    damages: {
        type: String, 
        required: true,
        minLength:[10, 'characters required minimum with 10 length'],
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
    description: {
        type: String, 
        required: true,
        minLength:[10, 'characters required minimum with 10 length'],
        maxLength:[200, 'characters required maximum with 200 length'],
    },
    production: {
        type: Number, 
        required: true,
        minValue: 1900,
        maxValue: 2023,
    },
    exploitation: {
        type: Number, 
        required: true,
        minLength: 0,  //The exploitation should be a positive number.
    },
    price: {
        type: Number, 
        required: true,
        minLength: 0,  //The price should be a positive number.
    },
    buyingList: [{ //buyers ----> logic for referencing the users buy or do staff related to this
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    owner: { //Owner - object Id (a reference to the User model)
        type: mongoose.Types.ObjectId,
        ref: 'User', // reference to the User model (1 owner - many cryptos)
    },

});

const Electronics = mongoose.model('Electronics', electronicsSchema);
module.exports = Electronics;
