const Curse = require('../models/Curse');


exports.create = (ownerId, formData) => Curse.create({ ...formData, owner: ownerId } ); // { runValidators: true }?

exports.edit = (cryptoId, cryptoData) => Curse.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true });

exports.delete = async (cryptoId) => Curse.findByIdAndDelete(cryptoId);

exports.getAll = () => Curse.find(); //

exports.getOne = (cryptoId) => Curse.findById(cryptoId).lean();


exports.buy = async (userId, cryptoId) => {
    //alternative --> du all up whit 1 mongoDb query find & update
    await Curse.findByIdAndUpdate(cryptoId, { $push: {signUpList: userId} });
};

//******************* Home Page last 3 ****************************************************************** */
exports.getLast3 = () => Curse.find().sort({ _id: -1 }).limit(3);

//************************ bonus ******************************************************************* */
exports.getAllParticipantsUsers = (cryptoId) => Curse.findById(cryptoId).populate('owner') 

exports.getOwnerCreatedCurse = (userId) => Curse.find({owner: userId}); // get curses created by current user
exports.getOwnerSignUpList = (userId) => Curse.find({signUpList: userId});

exports.getAllUsersCheck = async(cryptoId) => await Curse.findById(cryptoId, { $pull: { signUpList: [] } });