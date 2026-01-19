import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign(
    { id }, // only Mongo _id
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
