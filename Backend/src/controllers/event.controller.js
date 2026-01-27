import Event from "../models/Event.js";
import User from "../models/User.js";


// ============================
// CREATE EVENT (HOD ONLY)
// ============================
export const createEvent = async (req, res) => {

  try {

    const {
      title,
      shortDescription,
      description,
      startDate,
      endDate,
      venueOverview,
      coordinatorId
    } = req.body;

    // ---------- BASIC VALIDATION ----------

    if (
      !title ||
      !shortDescription ||
      !description ||
      !startDate ||
      !endDate ||
      !venueOverview ||
      !coordinatorId
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // ---------- ROLE CHECK ----------

    if (req.user.role !== "HOD") {
      return res.status(403).json({
        message: "Only HOD can create events"
      });
    }

    // ---------- DATE VALIDATION ----------

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "End date must be after start date"
      });
    }

    // ---------- IMAGE ----------

    const bannerImage = req.file
      ? `/uploads/events/${req.file.filename}`
      : "";

    // ---------- COORDINATOR VALIDATION ----------

    const coordinator = await User.findById(coordinatorId);

    if (!coordinator || coordinator.role !== "COORDINATOR") {
      return res.status(400).json({
        message: "Invalid coordinator"
      });
    }

    // ---------- DEPARTMENT SECURITY ----------

    if (
      coordinator.departmentId.toString() !==
      req.user.departmentId.toString()
    ) {
      return res.status(403).json({
        message: "Coordinator must belong to same department"
      });
    }

    // ---------- CREATE EVENT ----------

    const event = await Event.create({

      title,
      shortDescription,
      description,
      bannerImage,
      startDate,
      endDate,
      venueOverview,

      departmentId: req.user.departmentId,
      coordinator: coordinatorId,
      createdBy: req.user._id,

      isPublished: true,
      registrationOpen: true,
      isDeleted: false
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

// ============================
// GET ALL PUBLISHED EVENTS
// ============================

export const getAllEvents = async (req, res) => {

  try {

    const events = await Event.find({
      isPublished: true,
      isDeleted: false
    })
      .select("-__v")
      .populate("coordinator", "fullName")
      .sort({ startDate: 1 });

    res.status(200).json(events);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// ============================
// STUDENT EVENTS (DEPARTMENT)
// ============================

export const getStudentEvents = async (req, res) => {

  try {

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Students only"
      });
    }

    if (!req.user.departmentId) {
      return res.status(400).json({
        message: "Student not assigned to department"
      });
    }

    const events = await Event.find({
      departmentId: req.user.departmentId,
      isPublished: true,
      isDeleted: false
    })
      .sort({ startDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getMyEvents = async (req, res) => {

  try {

    const events = await Event.find({
      createdBy: req.user._id,
      isDeleted: false
    })
    .sort({ createdAt: -1 });

    res.status(200).json(events);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const updateEvent = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      title,
      shortDescription,
      description,
      startDate,
      endDate,
      venueOverview,
      coordinatorId
    } = req.body;

    // ---------------- FIND EVENT ----------------

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // ---------------- SECURITY ----------------

    // Only creator HOD
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to edit this event"
      });
    }

    // Cannot edit deleted event
    if (event.isDeleted) {
      return res.status(400).json({
        message: "Cannot edit deleted event"
      });
    }

    // Cannot edit after event started
    if (new Date() >= event.startDate) {
      return res.status(400).json({
        message: "Cannot edit event after it has started"
      });
    }

    // ---------------- DATE VALIDATION ----------------

    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({
          message: "End date must be after start date"
        });
      }
    }

    // ---------------- COORDINATOR CHECK ----------------

    if (coordinatorId) {

      const coordinator = await User.findById(coordinatorId);

      if (!coordinator || coordinator.role !== "COORDINATOR") {
        return res.status(400).json({
          message: "Invalid coordinator"
        });
      }

      if (
        coordinator.departmentId.toString() !==
        req.user.departmentId.toString()
      ) {
        return res.status(403).json({
          message: "Coordinator must belong to same department"
        });
      }

      event.coordinator = coordinatorId;
    }

    // ---------------- IMAGE UPDATE ----------------

    if (req.file) {
      event.bannerImage = `/uploads/events/${req.file.filename}`;
    }

    // ---------------- FIELD UPDATE ----------------

    if (title) event.title = title;
    if (shortDescription) event.shortDescription = shortDescription;
    if (description) event.description = description;
    if (venueOverview) event.venueOverview = venueOverview;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;

    await event.save();

    res.status(200).json({
      message: "Event updated successfully",
      event
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const publishEvent = async (req, res) => {

  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  event.isPublished = true;
  event.publishedAt = new Date();

  await event.save();

  res.json({ message: "Event published" });
};

export const unpublishEvent = async (req, res) => {

  const event = await Event.findById(req.params.id);

  if (!event) return res.status(404).json({ message: "Event not found" });

  event.isPublished = false;

  await event.save();

  res.json({ message: "Event unpublished" });
};

export const deleteEvent = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event || event.isDeleted) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // ---------------- BLOCK DELETE IF ONGOING OR COMPLETED ----------------

    const now = new Date();

    if (now >= event.startDate) {
      return res.status(400).json({
        message: "Ongoing or completed events cannot be deleted"
      });
    }

    // ---------------- SOFT DELETE ----------------

    event.isDeleted = true;
    await event.save();

    res.status(200).json({
      message: "Event deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};


export const restoreEvent = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    event.isDeleted = false;

    await event.save();

    res.status(200).json({
      message: "Event restored"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};



export const getEventById = async (req, res) => {

  try {

    const { id } = req.params;

    const event = await Event.findById(id)
      .populate("coordinator", "fullName");

    if (!event || event.isDeleted) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    // Only HOD who created it OR same department HOD
    if (
      req.user.role !== "HOD" ||
      event.departmentId.toString() !== req.user.departmentId.toString()
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    res.status(200).json(event);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const getHodDashboardStats = async (req, res) => {

  try {

    const hodId = req.user._id;

    const { from, to } = req.query;

    let filter = {
      createdBy: hodId,
      isDeleted: false
    };

    // ---------- DATE FILTER ----------

    if (from && to) {

      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to)
      };

    }

    const events = await Event.find(filter);

    const total = events.length;

    const upcoming = events.filter(
      e => e.liveStatus === "upcoming"
    ).length;

    const ongoing = events.filter(
      e => e.liveStatus === "ongoing"
    ).length;

    const completed = events.filter(
      e => e.liveStatus === "completed"
    ).length;

    // ---------- MONTHLY TREND ----------

    const monthlyStats = {};

    events.forEach(event => {

      const month = new Date(event.createdAt)
        .toLocaleString("default", { month: "short" });

      monthlyStats[month] = (monthlyStats[month] || 0) + 1;

    });

    const monthlyChart = Object.keys(monthlyStats).map(month => ({
      month,
      count: monthlyStats[month]
    }));

    res.status(200).json({

      total,
      upcoming,
      ongoing,
      completed,

      charts: {

        statusChart: [
          { name: "Upcoming", value: upcoming },
          { name: "Ongoing", value: ongoing },
          { name: "Completed", value: completed }
        ],

        monthlyChart

      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

export const getEventPerformanceRanking = async (req, res) => {

  try {

    const hodDepartment = req.user.departmentId;

    const ranking = await Registration.aggregate([

      {
        $lookup: {
          from: "events",
          localField: "competition",
          foreignField: "_id",
          as: "eventData"
        }
      },

      { $unwind: "$eventData" },

      {
        $match: {
          "eventData.departmentId": hodDepartment
        }
      },

      {
        $group: {
          _id: "$eventData._id",
          title: { $first: "$eventData.title" },
          banner: { $first: "$eventData.bannerImage" },
          registrations: { $sum: 1 }
        }
      },

      {
        $sort: { registrations: -1 }
      },

      {
        $limit: 10
      }

    ]);

    res.status(200).json(ranking);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Performance ranking fetch failed"
    });

  }

};
