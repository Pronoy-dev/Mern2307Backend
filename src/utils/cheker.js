const emailChecker = (email) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email.toLowerCase());
};

const passwordCheker = (password) => {
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  return passwordRegex.test(password);
};

const bdNumberChecker = (number) => {
  const numberRegex = /^(?:(?:\+|00)88|01)?\d{11}$/;
  return numberRegex.test(number);
};
module.exports = { emailChecker, passwordCheker, bdNumberChecker };
