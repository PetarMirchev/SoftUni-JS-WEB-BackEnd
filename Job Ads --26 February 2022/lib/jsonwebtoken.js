const jwt = require('jsonwebtoken');
const util = require('util');

// convert from collbacked-based to promise-based 
exports.sign = util.promisify(jwt.sign);
exports.verify = util.promisify(jwt.verify);
