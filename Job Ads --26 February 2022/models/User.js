const mongoose = require('mongoose');


const emailRegex = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/;



const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: [true, 'Please enter a valid email address'],
        //minLength: [10, 'email should be minimum with 10 length!'], //! ? depending on the task!
        match: [emailRegex, 'Please fill a valid email address'], //! ? depending on the task!
        // unique: {value: true, message: 'this email is already in use'},
    },
    password: {
        type: String, 
        required: true,
        //minLength: 4,   //! ? depending on the task!
        //maxLength: 50,  //! ? depending on the task!

        // validate: { //! ? depending on the task!
        //     validator: function (value){
        //         return /^[A-Za-z0-9]+$/.test(value)
        //     },
        //     message: 'Password must be only english characters!'
        // },
    },
    description: {   //old username:
        type: String,
        required: [true, 'Please enter a description'],
        //minLength: [5, 'characters required minimum with 5 length'], //! ? depending of the task!
        // maxLength: 50,   //! ? depending of the task!
        // match: [/^[A-Za-z0-9]+$/, 'Username must be in english'],   //! ? depending on the task!
       // unique: {value: true, message: 'this name is already in use'},
    },
    myAds: [{  //Owner - object Id (a reference to the User model)
        type: mongoose.Types.ObjectId,
        ref: 'Ads', // reference to the User model (1 owner - many cryptos)
    }],
},  
    { timestamps: true },
);


const User = mongoose.model('User', userSchema);
module.exports = User;