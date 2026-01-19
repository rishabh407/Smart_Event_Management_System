// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {

//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized" });
//   }
  
//   try {

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("TOKEN ID =>", decoded.id);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();

//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {

    return res.status(401).json({ message: "Token expired" });

  }
};
