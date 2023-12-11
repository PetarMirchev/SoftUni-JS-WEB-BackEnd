const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        required: [true, 'Please enter a username'],
        minLength: [5, 'characters required minimum with 5 length'], //! ? depending of the task!
        // maxLength: 50,   //! ? depending of the task!
        // match: [/^[A-Za-z0-9]+$/, 'Username must be in english'],   //! ? depending on the task!
        unique: {value: true, message: 'this name is already in use'},
    },
    email: {
        type: String, 
        required: [true, 'Please enter a valid email address'],
        minLength: [10, 'email should be minimum with 10 length!'], //! ? depending on the task!
    },
    password: {
        type: String, 
        required: true,
        minLength: 4,   //! ? depending on the task!
        //maxLength: 50,  //! ? depending on the task!

        // validate: { //! ? depending on the task!
        //     validator: function (value){
        //         return /^[A-Za-z0-9]+$/.test(value)
        //     },
        //     message: 'Password must be only english characters!'
        // },
    },

},  
    { timestamps: true },
// {  //validation of repeatPassword extra logic -- not save in DB (most cases used as guard or extra validation)
//     virtuals: {
//         repeatPassword: {
//             set(value){
//                 if(this.password !== value){
//                     throw new mongoose.Error(`Passwords do not match!`);
//                 }
//             }
//         }
//     }
// }
);


const User = mongoose.model('User', userSchema);
module.exports = User;