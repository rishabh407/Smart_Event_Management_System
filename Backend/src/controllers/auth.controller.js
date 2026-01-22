// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
// import User from "../models/User.js";
// import { generateToken } from "../utils/jwt.js";

// // ================================
// // REGISTER STUDENT (PUBLIC)
// // ================================

// export const registerStudent = async (req, res) => {
//   try {
//     const { fullName, rollNumber, course, year, section } = req.body;

//     if (!fullName || !rollNumber || !course || !year || !section) {
//       return res.status(400).json({ message: "All student fields required" });
//     }

//     const existingStudent = await User.findOne({ rollNumber });

//     if (existingStudent) {
//       return res.status(400).json({ message: "Roll number already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(rollNumber, 10);

//     const student = await User.create({
//       userId: uuidv4(),
//       fullName,
//       rollNumber,
//       course,
//       year,
//       section,
//       password: hashedPassword,
//       role: "STUDENT",
//       isFirstLogin: true
//     });

//     const token = generateToken({
//       userId: student.userId,
//       role: student.role
//     });

//     res.status(201).json({
//       message: "Student registered successfully",
//       token,
//       student: {
//         userId: student.userId,
//         fullName: student.fullName,
//         rollNumber: student.rollNumber,
//         role: student.role,
//         isFirstLogin: student.isFirstLogin
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================================
// // REGISTER STAFF (HOD ONLY)
// // ================================

// export const registerStaff = async (req, res) => {
//   try {
//     const { fullName, email, password, role, departmentId } = req.body;

//     if (req.user.role !== "HOD") {
//       return res.status(403).json({ message: "Only HOD can create staff accounts" });
//     }

//     if (!fullName || !email || !password || !role || !departmentId) {
//       return res.status(400).json({ message: "All staff fields required" });
//     }

//     if (!["TEACHER", "COORDINATOR"].includes(role)) {
//       return res.status(400).json({ message: "Invalid staff role" });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const staff = await User.create({
//       userId: uuidv4(),
//       fullName,
//       email,
//       password: hashedPassword,
//       role,
//       departmentId
//     });

//     res.status(201).json({
//       message: "Staff account created successfully",
//       staff: {
//         userId: staff.userId,
//         fullName: staff.fullName,
//         email: staff.email,
//         role: staff.role,
//         departmentId: staff.departmentId
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================================
// // LOGIN (ALL USERS)
// // ================================

// export const login = async (req, res) => {
//   try {
//     const { identifier, password } = req.body;

//     if (!identifier || !password) {
//       return res.status(400).json({ message: "Login credentials required" });
//     }

//     const user = await User.findOne({
//       $or: [{ email: identifier }, { rollNumber: identifier }]
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!user.isActive) {
//       return res.status(403).json({ message: "Account disabled" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         userId: user.userId,
//         fullName: user.fullName,
//         email: user.email,
//         role: user.role,
//         departmentId: user.departmentId,
//         rollNumber: user.rollNumber,
//         isFirstLogin: user.isFirstLogin
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================================
// // CHANGE PASSWORD (PROTECTED)
// // ================================

// export const changePassword = async (req, res) => {
//   try {
//     const { newPassword } = req.body;

//     if (!newPassword) {
//       return res.status(400).json({ message: "New password required" });
//     }

//     if (newPassword.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     await User.updateOne(
//       { _id: req.user._id },
//       {
//         password: hashedPassword,
//         isFirstLogin: false
//       }
//     );

//     res.json({ message: "Password changed successfully" });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, generateToken } from "../utils/jwt.js";

// ================================
// REGISTER STUDENT (PUBLIC)
// ================================

export const registerStudent = async (req, res) => {

 try {

  const { fullName, rollNumber, course, year, section } = req.body;

  // 1. Validation
  if (!fullName || !rollNumber || !course || !year || !section) {
   return res.status(400).json({
    message: "All student fields required"
   });
  }
     if (!["HOD", "COORDINATOR"].includes(req.user.role)) {
  return res.status(403).json({
    message: "Only staff can create students"
  });
}

  // 2. Check existing roll number
  const existingStudent = await User.findOne({ rollNumber });

  if (existingStudent) {
   return res.status(400).json({
    message: "Roll number already exists"
   });
  }

  // 3. Default password = rollNumber (hashed)
  const hashedPassword = await bcrypt.hash(rollNumber, 10);

  // 4. Create student
  const student = await User.create({

   userId: uuidv4(),

   fullName,
   rollNumber,
   course,
   year,
   section,

   password: hashedPassword,

   role: "STUDENT",
  
   // Auto assign department
  departmentId: req.user.departmentId,

   isFirstLogin: true   // 🔥 FORCE PASSWORD CHANGE

  });

  // 5. Send response (NO TOKEN HERE)
  res.status(201).json({

   message: "Student registered successfully",

   student: {
    id: student._id,
    fullName: student.fullName,
    rollNumber: student.rollNumber,
    role: student.role,
    isFirstLogin: student.isFirstLogin
   }

  });

 } catch (error) {

  console.error("STUDENT REGISTER ERROR:", error);

  res.status(500).json({
   message: "Server error"
  });

 }
};


// ================================
// REGISTER STAFF (HOD ONLY)
// ================================

export const registerStaff = async (req, res) => {
  try {
    const { fullName, email, password, role, departmentId } = req.body;

    if (req.user.role !== "HOD") {
      return res.status(403).json({ message: "Only HOD can create staff accounts" });
    }

    if (!fullName || !email || !password || !role || !departmentId) {
      return res.status(400).json({ message: "All staff fields required" });
    }

    if (!["TEACHER", "COORDINATOR"].includes(role)) {
      return res.status(400).json({ message: "Invalid staff role" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await User.create({
      userId: uuidv4(),
      fullName,
      email,
      password: hashedPassword,
      role,
      departmentId
    });

    res.status(201).json({
      message: "Staff account created successfully",
      staff: {
        userId: staff.userId,
        fullName: staff.fullName,
        email: staff.email,
        role: staff.role,
        departmentId: staff.departmentId
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================================
// LOGIN (ALL USERS)
// ================================


// export const login = async (req, res) => {

//   const { identifier, password } = req.body;
//    console.log(req.body); 
//   const user = await User.findOne({
//     $or: [{ email: identifier }, { rollNumber: identifier }]
//   }).select("+password");

//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const match = await bcrypt.compare(password, user.password);

//   if (!match) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const accessToken = generateAccessToken({
//     id: user._id,
//     role: user.role
//   });

//   const refreshToken = generateRefreshToken({
//     id: user._id
//   });

//   // ================= COOKIE SET =================

//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     secure: false, // true in production HTTPS
//     sameSite: "strict",
//     maxAge: 15 * 60 * 1000
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000
//   });

//   res.json({
//     message: "Login successful",
//     user: {
//       id: user._id,
//       fullName: user.fullName,
//       role: user.role
//     }
//   });
// };


export const login = async (req, res) => {

 try {

  const { identifier, password } = req.body;

  // 1. Find user
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { rollNumber: identifier }
    ]
  }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 3. Generate tokens
  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    id: user._id
  });

  // 4. Set cookies (LOCALHOST CONFIG)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,       // true in production
    sameSite: "lax",     // IMPORTANT
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // 5. Send response
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      fullName: user.fullName,
      role: user.role,
      isFirstLogin: user.isFirstLogin
    }
  });

 } catch (error) {

  console.error("LOGIN ERROR:", error);

  res.status(500).json({
    message: "Server error"
  });

 }
};



// ================================
// CHANGE PASSWORD (PROTECTED)
// ================================

export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: req.user._id },
      {
        password: hashedPassword,
        isFirstLogin: false
      }
    );

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = generateAccessToken({
      id: decoded.id
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.json({ message: "Token refreshed" });

  } catch (error) {

    res.status(403).json({ message: "Invalid refresh token" });

  }
};

export const logout = (req, res) => {
  // console.log("User logout Successfully");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {

    // protect middleware already attached user
    const userdata = req.user;
  //  console.log(user._id);
    res.json({
      user: {
        id: userdata._id,
        fullName: userdata.fullName,
        role: userdata.role,
        email: userdata.email
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch user"
    });

  }
};
