// const Crypto = require('../models/Crypto');
const Electronics = require('../models/Electronics');


exports.create = (ownerId, formData) => Electronics.create({ ...formData, owner: ownerId } ); // { runValidators: true }?

exports.edit = (cryptoId, cryptoData) => Electronics.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true });

exports.delete = async (cryptoId) => Electronics.findByIdAndDelete(cryptoId);

exports.getAll = () => Electronics.find(); //

exports.getOne = (cryptoId) => Electronics.findById(cryptoId).lean();


exports.buy = async (userId, cryptoId) => {
    //du by 2 query (find & save)
    const crypto = await Electronics.findById(cryptoId);
    crypto.buyingList.push(userId);   //buyingList: [{ //buyers 
    return await crypto.save();

    //alternative --> du all up whit 1 mongoDb query find & update
    // Crypto.findByIdAndUpdate(cryptoId, { $push: {buyers: userId} });
};



//************************bonus search******************************************************************* */
// exports.searchQuery = (cryptoSearchName, cryptoPay) => {
//     if(cryptoSearchName){
//         //set Query to search in DB 
//         return (Electronics.find({ name: {$regex: cryptoSearchName, $options: 'i'} }).lean());
//     }

//     if(!cryptoSearchName && cryptoPay){
//         //set Query to search in DB 
//         return (Electronics.find({payment: cryptoPay}).lean());
//     }
// };



//! search by 2 criteria (name & payment method)
exports.searchQuery = (cryptoSearchName, cryptoPay) => {
    if(cryptoSearchName){
        //set Query to search in DB 
        return (Electronics.find({ name: {$regex: cryptoSearchName, $options: 'i'} }).lean());
    }

    if(!cryptoSearchName && cryptoPay){
        //set Query to search in DB 
        return (Electronics.find({type: {$regex: cryptoPay, $options: 'i'} }).lean());
    }
};
//******************************************************************************************************** */