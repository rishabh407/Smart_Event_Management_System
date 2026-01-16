import Registration from "../models/Registration.js";

/**
 * QR SCAN ATTENDANCE
 */
export const scanAttendance = async (req, res) => {
  const { registrationId, competitionId } = req.body;

  if (!registrationId || !competitionId) {
    return res.status(400).json({
      message: "Invalid QR data"
    });
  }

  const registration = await Registration.findOne({
    registrationId,
    competitionId
  });

  if (!registration) {
    return res.status(404).json({
      message: "Registration not found"
    });
  }

  if (registration.status === "attended") {
    return res.status(400).json({
      message: "Already marked present"
    });
  }

  registration.status = "attended";
  await registration.save();

  res.json({
    message: "Attendance marked successfully"
  });
};
