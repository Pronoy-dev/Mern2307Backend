const jwt = require('jsonwebtoken');

const GenerateToken = async (payload)=> {
    try {
        const token =  await jwt.sign(payload, process.env.TOKEN_SECRECT, { expiresIn: process.env.TOKEN_SECRECT_EXPIARY });
        return token
          
    } catch (error) {
        console.log("Error from Generate Token" , error);
        
    }
}

module.exports = {GenerateToken}
