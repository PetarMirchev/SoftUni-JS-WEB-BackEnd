const mongoose = require('mongoose');

const dogSchema = new mongoose.Schema({
    name:{
        require: [true, "Name is required"],
        type:String,
        minLength: 3,
        maxLength: 30,
    },
    age: Number,
    color: String,
});


const Dog = mongoose.model("Dog", dogSchema);
module.exports = Dog;