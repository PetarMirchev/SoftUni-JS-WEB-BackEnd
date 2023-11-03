const User = require('../models/User');
//const Crypto = require('../models/Crypto');
//const Animals = require('../models/Animals');
const Ads = require('../models/Ads');





exports.create = (ownerId, formData) => Ads.create({ ...formData, owner: ownerId });

exports.edit = (cryptoId, cryptoData) => Ads.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true });

exports.delete = async (cryptoId) => Ads.findByIdAndDelete(cryptoId);

exports.getAll = () => Ads.find(); //

exports.getOne = (cryptoId) => Ads.findById(cryptoId).populate('owner') ; //! Сложихме populate за да се вземe  owner.username в details.hbs


//!Last three posts - home page
exports.lastThree = () => Ads.find().sort({ _id: [ 1 ]}).limit(3);



//!for user profile page
exports.findOwner = (userId) => User.findById(userId).lean(); //! in case we need User name or something to display
//exports.getMyCreatedPost = (userId) => Animals.find({ owner: userId}).lean();




exports.buy = async (userId, cryptoId) => {
    //du by 2 query (find & save)
    const crypto = await Ads.findById(cryptoId);
    crypto.votes.push(userId);
    return await crypto.save();

    //alternative --> du all up whit 1 mongoDb query find & update
    // Crypto.findByIdAndUpdate(cryptoId, { $push: {buyers: userId} });
};

//******************************************************************************************** */

//! Apply job
//exports.applied = (jobId, userId) => Job.findByIdAndUpdate(jobId, { $push: { applied: userId } })


//************************bonus search******************************************************************* */
//! search by 2 criteria (name & payment method)
// exports.searchQuery = (cryptoSearchName, cryptoPay) => {
//     if(cryptoSearchName){
//         //set Query to search in DB 
//         return (Crypto.find({ name: {$regex: cryptoSearchName, $options: 'i'} }).lean());
//     }

//     if(!cryptoSearchName && cryptoPay){
//         //set Query to search in DB 
//         return (Crypto.find({payment: cryptoPay}).lean());
//     }
// };

//!  1 search by email address
exports.search1 = async (search) => { 

    const allData = await Ads.find().populate('owner').lean();
    const result = allData.filter(x => x.owner.email.toLowerCase().includes(search.toLowerCase()))
    
    return result;
};
//******************************************************************************************************** */
