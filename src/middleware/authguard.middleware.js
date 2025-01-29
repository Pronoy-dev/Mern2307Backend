const jwt = require("jsonwebtoken");

const authguard = async (req, res, next) => {
  try {
    if (req.headers.cookie) {
      const token = req.headers.cookie.replace("token=", "").trim();

      const decoded = jwt.verify(token, process.env.TOKEN_SECRECT);
      if (!decoded) {
        res.status(401).json({ msg: "invalid Token" });
      }
      req.user = decoded;
      next();
    } else if (req.headers.authorization) {
      const token = req.headers.authorization.replace("Bearer ", "").trim();
      const decoded = jwt.verify(token, process.env.TOKEN_SECRECT);
      if (!decoded) {
        res.status(401).json({ msg: "invalid Token" });
      }
      req.user = decoded;
      next();
    } else {
      res.status(401).json({ message: "Token Missing " });
    }
  } catch (error) {
    console.error("error form authguard middleware", error);
  }
};

module.exports = { authguard };
