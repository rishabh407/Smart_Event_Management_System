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
//  console.log(token);  
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

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {

//   try {

//     let token;

//     // 1️⃣ Get token from cookie OR header

//     if (req.cookies?.accessToken) {
//       token = req.cookies.accessToken;
//     } else if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // 2️⃣ Check token exists

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required"
//       });
//     }

//     // 3️⃣ Verify token

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 4️⃣ Attach safe user data only

//     const user = await User.findById(decoded.id).select(
//       "_id fullName email role departmentId"
//     );

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid token"
//       });
//     }

//     // 5️⃣ Attach user to request

//     req.user = user;

//     next();

//   } catch (error) {

//     console.error("Auth Error:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Session expired. Please login again"
//     });

//   }
// };
