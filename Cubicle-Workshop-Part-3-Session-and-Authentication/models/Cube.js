const mongoose = require('mongoose');


const cubeSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    imageUrl: String,
    difficultyLevel: Number,
    //! logic Schema to attach accessories (extra objects to main object from oder collection)
    accessories: [
        {
            type: mongoose.Types.ObjectId, // type from mongo
            ref: "Accessory", // the name of the model
        }
    ]
});


const Cube = mongoose.model("Cube", cubeSchema);

module.exports = Cube;