export const teacherOnly = (req, res, next) => {
  if (req.user.role !== "teacher" && req.user.role !== "hod") {
    return res.status(403).json({ message: "Teachers only" });
  }
  next();
};

export const hodOnly = (req, res, next) => {
  if (req.user.role !== "hod") {
    return res.status(403).json({ message: "HOD only" });
  }
  next();
};
