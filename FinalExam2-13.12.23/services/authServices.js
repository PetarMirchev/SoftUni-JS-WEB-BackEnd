const User = require("../models/User");
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../secretKey');
const { extractErrorMessage } = require('../errorHelper.js');


exports.register = async (username, email, password) => {

    //Check if user exists already in DB
    const isEmailExistsInDB = await User.findOne({email});
    if (isEmailExistsInDB){
        throw new Error("this Email is used already!");
    }

    const isUserExistsInDB = await User.findOne({username});
    if(isUserExistsInDB){
        throw new Error("User name is used already!");
    }
    
    //Validate password --> long 10 characters, specifically char, etc....
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({username, email, password: hashedPassword});

  
   //!if is need to return directly Login user in home page
       // generate new token
       const payload = {
        _id: user._id,
        email,
        username: user.username, //! optional property - според условието на задачата задаваме пропъртитата
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: "2d" }); 
    return token;
    //!
    
};

//*********************************************************************************************************** */

exports.login =  async (email, password) => {
    // user exists in DB
    const user = await User.findOne({email});
    if(!user){
        throw new Error("invalid email or password!");
    }

    // password is valid
    const isValidPassword = await bcrypt.compare(password, user.password)

    if(!isValidPassword){
        throw new Error("invalid email or password!");
    }


    // generate new token
    const payload = {
        _id: user._id,
        email,
        username: user.username, //! optional property - според условието на задачата задаваме пропъртитата
    };

    const token = await jwt.sign(payload, SECRET, { expiresIn: "2d" }); 

    return token;
}


//************************************************************************* */
//USER Profile
//! Find Owner
exports.findOwner = (userId) =>  User.findById(userId);  // За да вземем името на потребителят
