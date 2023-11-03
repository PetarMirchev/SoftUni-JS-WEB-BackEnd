const mongoose = require('mongoose');
const VALIDATE_IMAGE = /^https?:\/\/.+$/;


//! is better (to don't have problems) to match model names whit create or register form name='' fields!
const adSchema = new mongoose.Schema({
    headline: {
        type: String, 
        required: true,
        minLength:[3, 'characters required minimum with 3 length'],
        // maxLength:[40, 'characters required maximum with 40 length'],
    },
    location: {
        type: String, 
        required: true,
    },
    companyName: {
        type: String, 
        required: true,
    },
    companyDescription: {
        type: String, 
        required: true,
        minLength:[10, 'characters required minimum with 10 length'],
        maxLength:[200, 'characters required maximum with 200 length'],
    },
      owner: { //Owner - object Id (a reference to the User model)
        type: mongoose.Types.ObjectId,
        ref: 'User', // reference to the User model (1 owner - many cryptos)
    },
    //***************************************************************************************************** */
    //actions related to the product/item interaction
    //Note: When a user applies for an ad, their id is added to this collection (Users applied). 
    votes: [{ // ----> logic for referencing the users buy or do staff related to this
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    //***************************************************************************************************** */
  
}, 
{ timestamps: true }
);


const Ads = mongoose.model('Ads', adSchema);
module.exports = Ads;