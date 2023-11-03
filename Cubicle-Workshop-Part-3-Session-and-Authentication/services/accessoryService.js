const Accessory = require('../models/Accessory');


exports.create = (accessoryData) => {
    Accessory.create(accessoryData);
};

exports.getAll = () => { 
    Accessory.find();
};

exports.getWithoutOwned = (accessoryIDs) => {
    return Accessory.find({ _id: { $nin: accessoryIDs } });
};