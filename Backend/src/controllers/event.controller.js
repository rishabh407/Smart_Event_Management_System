import { v4 as uuidv4 } from "uuid";
import Event from "../models/Event.js";
import Department from "../models/Department.js";

/**
 * CREATE EVENT
 * HOD or Teacher (of same department)
 */
export const createEvent = async (req, res) => {
  const {
    departmentId,
    title,
    shortDescription,
    description,
    startDate,
    endDate,
    venueOverview,
    bannerImage,
  } = req.body;

  if (
    !departmentId ||
    !title ||
    !shortDescription ||
    !description ||
    !startDate ||
    !endDate ||
    !venueOverview
  ) {
    return res.status(400).json({ message: "All required fields missing" });
  }

  const department = await Department.findOne({ departmentId });
  if (!department) {
    return res.status(404).json({ message: "Department not found" });
  }

  // Authorization:
  // HOD of department OR teacher belonging to department
  if (
    req.user.role !== "hod" &&
    req.user.departmentId !== departmentId
  ) {
    return res.status(403).json({ message: "Not authorized to create event" });
  }

  const event = await Event.create({
    eventId: uuidv4(),
    departmentId,
    title,
    shortDescription,
    description,
    bannerImage,
    startDate,
    endDate,
    venueOverview,
  });

  res.status(201).json({
    message: "Event created successfully",
    event,
  });
};

/**
 * GET ALL EVENTS (Public)
 */
export const getAllEvents = async (req, res) => {
  console.log("HIT: getAllEvents");
  const events = await Event.find().sort({ startDate: 1 });
  console.log("EVENT COUNT:", events.length);
  res.json(events);
};


/**
 * GET EVENTS BY DEPARTMENT
 */
export const getEventsByDepartment = async (req, res) => {
  const events = await Event.find({
    departmentId: req.params.departmentId,
  });
  res.json(events);
};

/**
 * GET SINGLE EVENT
 */
export const getEventById = async (req, res) => {
  const event = await Event.findOne({ eventId: req.params.eventId });

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};
