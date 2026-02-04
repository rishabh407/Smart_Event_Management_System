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



export const coordinatorOnly = (req, res, next) => {

 if (req.user.role !== "COORDINATOR") {
  return res.status(403).json({
   message: "Coordinator access only"
  });
 }

 next();
};

export const studentOnly = (req, res, next) => {

  if (req.user.role !== "STUDENT") {
   return res.status(403).json({
    message: "Student access only"
   });
  }
 
  next();
 };

export const allowRoles = (...roles) => {

  return (req, res, next) => {

    const userRole = req.user.role.toUpperCase();
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };

};


