const mongoose = require('mongoose');
const VALIDATE_IMAGE = /^https?:\/\/.+$/;


//! is better (to don't have problems) to match model names whit create or register form name='' fields!
const animalsSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minLength:[3, 'characters required minimum with 3 length'],
        // maxLength:[40, 'characters required maximum with 40 length'],
    },
    species: {
        type: String, 
        required: true,
    },
    skinColor: {
        type: String, 
        required: true,
    },
    eyeColor: {
        type: String, 
        required: true,
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
    //***************************************************************************************************** */
    //actions related to the product/item interaction
    votes: [{ // ----> logic for referencing the users buy or do staff related to this
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    //***************************************************************************************************** */
    owner: { //Owner - object Id (a reference to the User model)
        type: mongoose.Types.ObjectId,
        ref: 'User', // reference to the User model (1 owner - many cryptos)
    },
}, 
{ timestamps: true }
);


const Animals = mongoose.model('Animals', animalsSchema);
module.exports = Animals;