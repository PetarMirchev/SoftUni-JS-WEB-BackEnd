const mongoose = require('mongoose');
const VALIDATE_EMAIL = /^([a-zA-Z]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/; // <name>@<domain>.<extension> -- valid email - "petar@softuni.bg"

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [true, 'Please enter a username'],
        minLength: [2, 'characters required minimum with 2 length'], //! ? depending of the task!
        // maxLength: 50,   //! ? depending of the task!
        // match: [/^[A-Za-z0-9]+$/, 'Username must be in english'],   //! ? depending on the task!
        // unique: {value: true, message: 'this name is already in use'},
    },
    email: {
        type: String, 
        required: [true, 'Please enter a valid email address'],
        minLength: [10, 'email should be minimum with 10 length!'], //! ? depending on the task!
        // validate: {
        //     validator(value) {
        //         return VALIDATE_EMAIL.test(value);
        //     },
        //     message: 'The email should be in the following format: <name>@<domain>.<extension>',
        // }
    },
    password: {
        type: String, 
        required: true,
        minLength: [4, 'characters required minimum with 2 length'],
    },
},  
    { timestamps: true },
);


const User = mongoose.model('User', userSchema);
module.exports = User;