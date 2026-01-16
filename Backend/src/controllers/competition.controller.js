import { v4 as uuidv4 } from "uuid";
import Competition from "../models/Competition.js";
import Event from "../models/Event.js";

/**
 * CREATE COMPETITION
 * Allowed: HOD or Teacher of same department
 */
export const createCompetition = async (req, res) => {
  const {
    eventId,
    name,
    shortDescription,
    rules,
    type,
    minTeamSize,
    maxTeamSize,
    maxParticipants,
    registrationDeadline,
    venue,
    startTime,
    endTime,
    assignedTeachers,
  } = req.body;

  if (
    !eventId ||
    !name ||
    !shortDescription ||
    !type ||
    !registrationDeadline ||
    !venue ||
    !startTime ||
    !endTime
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const event = await Event.findOne({ eventId });
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Authorization:
  // HOD OR teacher of same department
  if (
    req.user.role !== "hod" &&
    req.user.departmentId !== event.departmentId
  ) {
    return res
      .status(403)
      .json({ message: "Not authorized to create competition" });
  }

  // Team rules validation
  if (type === "team" && (!minTeamSize || !maxTeamSize)) {
    return res
      .status(400)
      .json({ message: "Team size required for team competition" });
  }

  const competition = await Competition.create({
    competitionId: uuidv4(),
    eventId,
    name,
    shortDescription,
    rules,
    type,
    minTeamSize,
    maxTeamSize,
    maxParticipants,
    registrationDeadline,
    venue,
    startTime,
    endTime,
    assignedTeachers,
  });

  res.status(201).json({
    message: "Competition created successfully",
    competition,
  });
};

/**
 * GET COMPETITIONS OF AN EVENT (Public)
 */
export const getCompetitionsByEvent = async (req, res) => {
  const competitions = await Competition.find({
    eventId: req.params.eventId,
  }).sort({ startTime: 1 });

  res.json(competitions);
};

/**
 * GET SINGLE COMPETITION
 */
export const getCompetitionById = async (req, res) => {
  const competition = await Competition.findOne({
    competitionId: req.params.competitionId,
  });

  if (!competition) {
    return res.status(404).json({ message: "Competition not found" });
  }

  res.json(competition);
};
