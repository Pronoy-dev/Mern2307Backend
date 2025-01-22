const bcrypt = require("bcrypt");
const makeHaspassword = async (plainPassword) => {
  try {
    const encryptedPass = await bcrypt.hash(plainPassword, 10);
    return encryptedPass;
  } catch (error) {
    console.log("Error from makeHashPassword method", error);
  }
};

const compareHashpassword = async (PlaintextPassword, hash) => {
  return await bcrypt.compare(PlaintextPassword, hash);
};

module.exports = { makeHaspassword, compareHashpassword };
