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
    if (!user.isActive) {
  return res.status(403).json({
    message: "Account is deactivated"
  });
}

    req.user = user;
    next();

  } catch (error) {

    return res.status(401).json({ message: "Token expired" });

  }
};
