import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"] || req.headers["Authorization"];

    if (!token) {
      return res.status(401).json({ message: "Authorization Token Missing" });
    }

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Invalid Authorization Token" });
        }
        req.user = decode.user;
        next();
      });
    } else {
      return res
        .status(401)
        .json({ message: "Invalid Authorization Token Format" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
