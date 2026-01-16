// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
// import User from "../models/User.js";
// import { generateToken } from "../utils/jwt.js";
// // import User from "../models/User.js";
// // import { generateToken } from "../utils/jwt.js";

// /**
//  * REGISTER
//  */
// export const register = async (req, res) => {
//   const { fullName, email, password, role,departmentId,rollNumber,course,year,section } = req.body;

//   if (!fullName || !email || !password || !role) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

// // Role validation
// if (!["student", "teacher", "hod"].includes(role)) {
//   return res.status(400).json({ message: "Invalid role" });
// }

// // Student validation
// if (role === "student") {
//   if (!rollNumber || !course || !year || !section) {
//     return res
//       .status(400)
//       .json({ message: "Student academic details required" });
//   }
// }


// // Teachers & HODs MUST have departmentId
// if ((role === "teacher" || role === "hod") && !departmentId) {
//   return res
//     .status(400)
//     .json({ message: "departmentId is required for teachers and HODs" });
// }

// // Students must NOT have departmentId
// if (role === "student" && departmentId) {
//   return res
//     .status(400)
//     .json({ message: "Students cannot have departmentId" });
// }


//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return res.status(400).json({ message: "Email already exists" });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   // const user = await User.create({
//   //   userId: uuidv4(),
//   //   fullName,
//   //   email,
//   //   password: hashedPassword,
//   //   role,
//   //   departmentId: role === "student" ? null : departmentId,
//   // });
// const user = await User.create({
//   userId: uuidv4(),
//   fullName,
//   email,
//   password: hashedPassword,
//   role,
//   departmentId: role === "student" ? null : departmentId,
//   rollNumber: role === "student" ? rollNumber : null,
//   course: role === "student" ? course : null,
//   year: role === "student" ? year : null,
//   section: role === "student" ? section : null,
// });


//   const token = generateToken({
//     userId: user.userId,
//     role: user.role,
//   });

//   // res.status(201).json({
//   //   message: "User registered successfully",
//   //   token,
//   //   user: {
//   //     userId: user.userId,
//   //     fullName: user.fullName,
//   //     email: user.email,
//   //     role: user.role,
//   //     departmentId: user.departmentId,  
//   //   },
//   // });
//   res.status(201).json({
//   message: "User registered successfully",
//   token,
//   user: {
//     userId: user.userId,
//     fullName: user.fullName,
//     email: user.email,
//     role: user.role,
//     departmentId: user.departmentId,

//     // Student fields (will be null for teachers/HOD)
//     rollNumber: user.rollNumber,
//     course: user.course,
//     year: user.year,
//     section: user.section,
//   },
// });

// };

// /**
//  * LOGIN
//  */
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email & password required" });
//   }

//   const user = await User.findOne({ email }).select("+password");

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = generateToken({
//     userId: user.userId,
//     role: user.role,
//   });

//   res.json({
//     message: "Login successful",
//     token,
//     user: {
//       userId: user.userId,
//       fullName: user.fullName,
//       email: user.email,
//       role: user.role,
//     },
//   });
// };

// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
// import User from "../models/User.js";
// import { generateToken } from "../utils/jwt.js";

// /**
//  * REGISTER
//  */
// export const register = async (req, res) => {
//   const {
//     fullName,
//     email,
//     password,
//     role,
//     departmentId,
//     rollNumber,
//     course,
//     year,
//     section
//   } = req.body;

//   if (!fullName || !role) {
//     return res.status(400).json({ message: "Required fields missing" });
//   }

//   // Role validation
//   if (!["student", "teacher", "hod"].includes(role)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }

//   // Student validation
//   if (role === "student") {
//     if (!rollNumber || !course || !year || !section) {
//       return res
//         .status(400)
//         .json({ message: "Student academic details required" });
//     }
//   }

//   // Teacher & HOD validation
//   if ((role === "teacher" || role === "hod") && !departmentId) {
//     return res
//       .status(400)
//       .json({ message: "departmentId required for teacher and hod" });
//   }

//   // Student must not send departmentId
//   if (role === "student" && departmentId) {
//     return res
//       .status(400)
//       .json({ message: "Students cannot have departmentId" });
//   }

//   // Duplicate email check
//   if (email) {
//     const existingEmail = await User.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }
//   }

//   // Duplicate roll number check
//   if (rollNumber) {
//     const existingRoll = await User.findOne({ rollNumber });
//     if (existingRoll) {
//       return res.status(400).json({ message: "Roll number already exists" });
//     }
//   }

//   // Password logic
//   let finalPassword = password;

//   // Student default password = roll number
//   if (role === "student") {
//     finalPassword = rollNumber;
//   }

//   const hashedPassword = await bcrypt.hash(finalPassword, 10);

//   const user = await User.create({
//     userId: uuidv4(),
//     fullName,
//     email,
//     password: hashedPassword,
//     role,

//     departmentId: role === "student" ? null : departmentId,

//     rollNumber: role === "student" ? rollNumber : undefined,
//     course: role === "student" ? course : undefined,
//     year: role === "student" ? year : undefined,
//     section: role === "student" ? section : undefined,

//     isFirstLogin: role === "student" ? true : false
//   });

//   const token = generateToken({
//     userId: user.userId,
//     role: user.role
//   });

//   res.status(201).json({
//     message: "User registered successfully",
//     token,
//     user: {
//       userId: user.userId,
//       fullName: user.fullName,
//       email: user.email,
//       role: user.role,
//       departmentId: user.departmentId,

//       rollNumber: user.rollNumber,
//       course: user.course,
//       year: user.year,
//       section: user.section,

//       isFirstLogin: user.isFirstLogin
//     }
//   });
// };

// /**
//  * LOGIN
//  */
// export const login = async (req, res) => {
//   const { identifier, password } = req.body;

//   if (!identifier || !password) {
//     return res
//       .status(400)
//       .json({ message: "Login credentials required" });
//   }
//   // $or represents any one condition become true
//   const user = await User.findOne({
//     $or: [
//       { email: identifier },
//       { rollNumber: identifier }
//     ]
//   }).select("+password");

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const token = generateToken({
//     userId: user.userId,
//     role: user.role
//   });

//   res.json({
//     message: "Login successful",
//     token,
//     user: {
//       userId: user.userId,
//       fullName: user.fullName,
//       email: user.email,
//       role: user.role,
//       departmentId: user.departmentId,

//       rollNumber: user.rollNumber,
//       course: user.course,
//       year: user.year,
//       section: user.section,

//       isFirstLogin: user.isFirstLogin
//     }
//   });
// };

import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

/**
 * REGISTER
 */
export const register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
    departmentId,
    rollNumber,
    course,
    year,
    section
  } = req.body;

  if (!fullName || !role) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // Role validation
  if (!["student", "teacher", "hod"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // Student validation
  if (role === "student") {
    if (!rollNumber || !course || !year || !section) {
      return res
        .status(400)
        .json({ message: "Student academic details required" });
    }
  }

  // Teacher & HOD validation
  if ((role === "teacher" || role === "hod")) {
    if (!departmentId || !email || !password) {
      return res.status(400).json({
        message: "Email, password and departmentId required for teacher and hod"
      });
    }
  }

  // Duplicate email check
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }

  // Duplicate roll number check
  if (rollNumber) {
    const existingRoll = await User.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(400).json({ message: "Roll number already exists" });
    }
  }

  // Password logic
  let finalPassword;

  if (role === "student") {
    finalPassword = rollNumber;
  } else {
    finalPassword = password;
  }

  const hashedPassword = await bcrypt.hash(finalPassword, 10);

  const user = await User.create({
    userId: uuidv4(),
    fullName,
    email,
    password: hashedPassword,
    role,

    ...(role !== "student" && { departmentId }),

    ...(role === "student" && {
      rollNumber,
      course,
      year,
      section,
      isFirstLogin: true
    })
  });

  const token = generateToken({
    userId: user.userId,
    role: user.role
  });

  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,

      rollNumber: user.rollNumber,
      course: user.course,
      year: user.year,
      section: user.section,

      isFirstLogin: user.isFirstLogin
    }
  });
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Login credentials required" });
  }

  const user = await User.findOne({
    $or: [
      { email: identifier },
      { rollNumber: identifier }
    ]
  }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    userId: user.userId,
    role: user.role
  });

  res.json({
    message: "Login successful",
    token,
    user: {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,

      rollNumber: user.rollNumber,
      course: user.course,
      year: user.year,
      section: user.section,

      isFirstLogin: user.isFirstLogin
    }
  });
};

/**
 * CHANGE PASSWORD (First Login / Normal Change)
 */
export const changePassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  // Optional security rule
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { userId: req.user.userId },
    {
      password: hashedPassword,
      isFirstLogin: false
    }
  );

  res.json({
    message: "Password changed successfully"
  });
};

