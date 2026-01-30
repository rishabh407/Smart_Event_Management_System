// import express from "express";
// import cors from "cors";
// // import morgan from "morgan";
// // import "express-async-errors";
// import dotenv from "dotenv";
// import connectDB from "./src/config.js/db.js";
// import authRoutes from "./src/routes/auth.routes.js";
// import departmentRoutes from "./src/routes/departments.routes.js";
// import eventRoutes from "./src/routes/event.routes.js";
// import competitionRoutes from "./src/routes/competition.routes.js";
// import teamRoutes from "./src/routes/team.routes.js";
// import registrationRoutes from "./src/routes/registration.routes.js";
// import attendanceRoutes from "./src/routes/attendance.routes.js";
// import resultRoutes from "./src/routes/result.routes.js";
// import certificateTemplateRoutes from "./src/routes/certificateTemplate.routes.js";
// import certificateRoutes from "./src/routes/certificate.routes.js";

// dotenv.config();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // app.use(morgan("dev"));

// app.use("/api/auth", authRoutes);
// app.use("/api/departments", departmentRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/competitions", competitionRoutes);
// app.use("/api/teams", teamRoutes);
// app.use("/api/registrations", registrationRoutes);
// app.use("/api/attendance", attendanceRoutes);
// app.use("/api/results", resultRoutes);

// app.use("/api/templates", certificateTemplateRoutes);
// app.use("/api/certificates", certificateRoutes);

// // Serve generated PDFs
// app.use("/certificates", express.static("certificates"));
// // import bcrypt from "bcrypt";

// // const hash = await bcrypt.hash("hod123", 10);
// // console.log(hash);


// const startServer = async () => {
//   await connectDB();

//   app.listen(process.env.PORT, () =>
//     console.log(`🚀 Server running on port ${process.env.PORT}`)
//   );
// };

// startServer();

// app.get("/", (req, res) => {
//   res.json({ message: "Smart Event Management API running" });
// });

// export default app;


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import morgan from "morgan";
// import "express-async-errors";
import dotenv from "dotenv";
import connectDB from "./src/config.js/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import departmentRoutes from "./src/routes/departments.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import competitionRoutes from "./src/routes/competition.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import registrationRoutes from "./src/routes/registration.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import resultRoutes from "./src/routes/result.routes.js";
import certificateTemplateRoutes from "./src/routes/certificateTemplate.routes.js";
import certificateRoutes from "./src/routes/certificate.routes.js";
import teacherRoutes from "./src/routes/teacher.routes.js";
import assignmentRoutes from "./src/routes/competitionAssignment.routes.js";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // React URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/templates", certificateTemplateRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/assignments", assignmentRoutes);

// Serve generated PDFs
app.use("/certificates", express.static("certificates"));
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("teacher2", 10);
console.log(hash);


const startServer = async () => {
  await connectDB();

  app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on port ${process.env.PORT}`)
  );
};

startServer();
app.get("/", (req, res) => {
  res.json({ message: "Smart Event Management API running" });
});

export default app;

// Student First Password aaaaaa.
