const Crypto = require('../models/Crypto');


exports.create = (ownerId, formData) => Crypto.create({ ...formData, owner: ownerId });

exports.edit = (cryptoId, cryptoData) => Crypto.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true });

exports.delete = async (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.getAll = () => Crypto.find(); //

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).lean();


exports.buy = async (userId, cryptoId) => {
    //du by 2 query (find & save)
    const crypto = await Crypto.findById(cryptoId);
    crypto.buyers.push(userId);
    return await crypto.save();

    //alternative --> du all up whit 1 mongoDb query find & update
    // Crypto.findByIdAndUpdate(cryptoId, { $push: {buyers: userId} });
};



//************************bonus search******************************************************************* */
exports.searchQuery = (cryptoSearchName, cryptoPay) => {
    if(cryptoSearchName){
        //set Query to search in DB 
        return (Crypto.find({ name: {$regex: cryptoSearchName, $options: 'i'} }).lean());
    }

    if(!cryptoSearchName && cryptoPay){
        //set Query to search in DB 
        return (Crypto.find({payment: cryptoPay}).lean());
    }
};
//******************************************************************************************************** */