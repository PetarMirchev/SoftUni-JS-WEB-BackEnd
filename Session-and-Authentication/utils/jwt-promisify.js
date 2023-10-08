const jwt = require('jsonwebtoken');
const util = require('util');

const jwtPromise = {
    sign: util.promisify(jwt.sign),
    verify: util.promisify(jwt.verify),
};

module.exports = jwtPromise;