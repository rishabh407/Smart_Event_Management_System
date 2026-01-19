export const teacherOnly = (req, res, next) => {

  const role = req.user.role.toUpperCase();

  if (role !== "TEACHER" && role !== "COORDINATOR") {
    return res.status(403).json({
      message: "Teachers only"
    });
  }
  next();
};



export const hodOnly = (req, res, next) => {
  if (req.user.role !== "HOD" &&  req.user.role!=="COORDINATOR") {
    return res.status(403).json({ message: "HOD only" });
  }
  next();
};



export const specialTeacher = (req, res, next) => {
  if (req.user.role !== "COORDINATOR") {
    return res.status(403).json({ message: "Spteacher only" });
  }
  next();
};
