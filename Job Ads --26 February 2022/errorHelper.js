const { MongooseError, Error } = require('mongoose');


exports.extractErrorMessage = (error) => {

    if (error instanceof MongooseError || error instanceof Error) {
        return Object.values(error.errors).map(err => err.message);
    } 
    
    
    return [error.message];

}



// function getFirstMongooseError(error) {
//     const errors = Object.keys(error.errors).map(key => error.errors[key].message);

//     return errors[0];
// };

// exports.extractErrorMessage = (error) => {
//     switch (error.name) {
//         case 'Error':
//             return [error.message];
//         case 'MongooseError':
//             return getFirstMongooseError(error);
//         default:
//             return [error.message];	
//     }
// };