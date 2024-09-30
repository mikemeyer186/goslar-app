const crypto = require('crypto');

const generateApiKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

console.log(generateApiKey());
