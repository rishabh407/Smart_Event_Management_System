import express from "express";
import cors from "cors";
// import morgan from "morgan";
// import "express-async-errors";
import dotenv from "dotenv";
import connectDB from "./src/config.js/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import { protect } from "./src/middlewares/auth.middleware.js";
import departmentRoutes from "./src/routes/departments.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import competitionRoutes from "./src/routes/competition.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import registrationRoutes from "./src/routes/registration.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import resultRoutes from "./src/routes/result.routes.js";
import certificateTemplateRoutes from "./src/routes/certificateTemplate.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/certificates/templates", certificateTemplateRoutes);

app.get("/api/test/protected", protect, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

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


