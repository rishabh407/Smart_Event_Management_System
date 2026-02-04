import Competition from "../models/Competition.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// Helper to build a notification object
const buildNotification = ({
  type,
  title,
  message,
  link,
  occursAt
}) => ({
  type,
  title,
  message,
  link,
  occursAt
});

// GET /api/notifications/my
// Runtime-computed notifications based on current time and user role
export const getMyNotifications = async (req, res) => {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const user = req.user;
    const role = user.role;
    const clearedAt = user.notificationsClearedAt || null;
    const notifications = [];

    // ===================== STUDENT =====================
    if (role === "STUDENT") {
      // Find all registrations (individual + team) for this student
      const regs = await Registration.find({
        $or: [
          { student: user._id },
          { registeredBy: user._id }
        ]
      }).populate("competition");

      const competitions = regs
        .map(r => r.competition)
        .filter(c => !!c && !c.isDeleted);

      for (const comp of competitions) {
        // Skip unpublished competitions
        if (!comp.isPublished) continue;

        // Registration closing within 24h or already closed recently
        if (comp.registrationDeadline) {
          if (comp.registrationDeadline > now && comp.registrationDeadline <= in24h) {
            notifications.push(
              buildNotification({
                type: "REGISTRATION_CLOSING",
                title: `Registration closing soon: ${comp.name}`,
                message: "Registration will close within 24 hours.",
                link: `/student/events/${comp.eventId}`,
                occursAt: comp.registrationDeadline
              })
            );
          } else if (
            comp.registrationDeadline <= now &&
            now.getTime() - comp.registrationDeadline.getTime() <=
              24 * 60 * 60 * 1000
          ) {
            notifications.push(
              buildNotification({
                type: "REGISTRATION_CLOSED",
                title: `Registration closed: ${comp.name}`,
                message: "Registrations for this competition have closed.",
                link: `/student/events/${comp.eventId}`,
                occursAt: comp.registrationDeadline
              })
            );
          }
        }

        // Competition starting within 24h
        if (comp.startTime > now && comp.startTime <= in24h) {
          notifications.push(
            buildNotification({
              type: "COMPETITION_STARTING",
              title: `Competition starting soon: ${comp.name}`,
              message: `Starts at ${comp.startTime.toLocaleString()}.`,
              link: `/student/events/${comp.eventId}`,
              occursAt: comp.startTime
            })
          );
        }

        // Competition ended within last 24h
        if (
          comp.endTime <= now &&
          now.getTime() - comp.endTime.getTime() <= 24 * 60 * 60 * 1000
        ) {
          notifications.push(
            buildNotification({
              type: "COMPETITION_ENDED",
              title: `Competition ended: ${comp.name}`,
              message: "This competition has recently ended.",
              link: `/student/events/${comp.eventId}`,
              occursAt: comp.endTime
            })
          );
        }
      }
    }

    // ===================== TEACHER =====================
    if (role === "TEACHER") {
      const myCompetitions = await Competition.find({
        "assignedTeachers.teacher": user._id,
        isDeleted: false
      });

      for (const comp of myCompetitions) {
        if (!comp.isPublished) continue;

        if (comp.registrationDeadline) {
          if (comp.registrationDeadline > now && comp.registrationDeadline <= in24h) {
            notifications.push(
              buildNotification({
                type: "REGISTRATION_CLOSING",
                title: `Registration closing for: ${comp.name}`,
                message: "Registration will close within 24 hours.",
                link: `/teacher/events/${comp.eventId}`,
                occursAt: comp.registrationDeadline
              })
            );
          }
        }

        if (comp.startTime > now && comp.startTime <= in24h) {
          notifications.push(
            buildNotification({
              type: "COMPETITION_STARTING",
              title: `Competition starting: ${comp.name}`,
              message: `Starts at ${comp.startTime.toLocaleString()}.`,
              link: `/teacher/events/${comp.eventId}`,
              occursAt: comp.startTime
            })
          );
        }

        if (
          comp.endTime <= now &&
          now.getTime() - comp.endTime.getTime() <= 24 * 60 * 60 * 1000
        ) {
          notifications.push(
            buildNotification({
              type: "COMPETITION_ENDED",
              title: `Competition ended: ${comp.name}`,
              message: "This competition has recently ended.",
              link: `/teacher/events/${comp.eventId}`,
              occursAt: comp.endTime
            })
          );
        }
      }
    }

    // ===================== COORDINATOR =====================
    if (role === "COORDINATOR") {
      const myEvents = await Event.find({
        coordinator: user._id,
        isDeleted: false
      });

      const eventIds = myEvents.map(e => e._id);

      // Event-level notifications for coordinator
      for (const event of myEvents) {
        if (event.startDate > now && event.startDate <= in24h) {
          notifications.push(
            buildNotification({
              type: "EVENT_STARTING",
              title: `Event starting soon: ${event.title}`,
              message: `Starts at ${event.startDate.toLocaleString()}.`,
              link: "/coordinator/events",
              occursAt: event.startDate
            })
          );
        }

        if (
          event.endDate <= now &&
          now.getTime() - event.endDate.getTime() <= 24 * 60 * 60 * 1000
        ) {
          notifications.push(
            buildNotification({
              type: "EVENT_ENDED",
              title: `Event ended: ${event.title}`,
              message: "This event has recently ended.",
              link: "/coordinator/events",
              occursAt: event.endDate
            })
          );
        }
      }

      // Competition-level notifications under coordinator's events
      const comps = await Competition.find({
        eventId: { $in: eventIds },
        isDeleted: false
      });

      for (const comp of comps) {
        if (!comp.isPublished) continue;

        if (comp.registrationDeadline) {
          if (comp.registrationDeadline > now && comp.registrationDeadline <= in24h) {
            notifications.push(
              buildNotification({
                type: "REGISTRATION_CLOSING",
                title: `Registration closing: ${comp.name}`,
                message: "Registration will close within 24 hours.",
                link: `/coordinator/events/${comp.eventId}/competitions`,
                occursAt: comp.registrationDeadline
              })
            );
          }
        }

        if (comp.startTime > now && comp.startTime <= in24h) {
          notifications.push(
            buildNotification({
              type: "COMPETITION_STARTING",
              title: `Competition starting: ${comp.name}`,
              message: `Starts at ${comp.startTime.toLocaleString()}.`,
              link: `/coordinator/events/${comp.eventId}/competitions`,
              occursAt: comp.startTime
            })
          );
        }

        if (
          comp.endTime <= now &&
          now.getTime() - comp.endTime.getTime() <= 24 * 60 * 60 * 1000
        ) {
          notifications.push(
            buildNotification({
              type: "COMPETITION_ENDED",
              title: `Competition ended: ${comp.name}`,
              message: "This competition has recently ended.",
              link: `/coordinator/events/${comp.eventId}/competitions`,
              occursAt: comp.endTime
            })
          );
        }
      }
    }

    // ===================== HOD =====================
    if (role === "HOD") {
      const myEvents = await Event.find({
        createdBy: user._id,
        isDeleted: false
      });

      for (const event of myEvents) {
        if (event.startDate > now && event.startDate <= in24h) {
          notifications.push(
            buildNotification({
              type: "EVENT_STARTING",
              title: `Event starting soon: ${event.title}`,
              message: `Starts at ${event.startDate.toLocaleString()}.`,
              link: "/hod/manage-events",
              occursAt: event.startDate
            })
          );
        }

        if (
          event.endDate <= now &&
          now.getTime() - event.endDate.getTime() <= 24 * 60 * 60 * 1000
        ) {
          notifications.push(
            buildNotification({
              type: "EVENT_ENDED",
              title: `Event ended: ${event.title}`,
              message: "This event has recently ended.",
              link: "/hod/manage-events",
              occursAt: event.endDate
            })
          );
        }
      }
    }

    // Filter out notifications cleared by user (persistent clear)
    const visibleNotifications = clearedAt
      ? notifications.filter(n => {
          if (!n.occursAt) return true;
          return new Date(n.occursAt) > clearedAt;
        })
      : notifications;

    // Sort notifications by time (soonest first)
    visibleNotifications.sort((a, b) => {
      const ta = a.occursAt ? new Date(a.occursAt).getTime() : now.getTime();
      const tb = b.occursAt ? new Date(b.occursAt).getTime() : now.getTime();
      return ta - tb;
    });

    res.json({
      success: true,
      count: visibleNotifications.length,
      data: visibleNotifications
    });
  } catch (error) {
    console.error("NOTIFICATIONS_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load notifications"
    });
  }
};

// POST /api/notifications/clear
// Persist "clear all" for this user
export const clearMyNotifications = async (req, res) => {
  try {
    req.user.notificationsClearedAt = new Date();
    await req.user.save();

    res.json({
      success: true,
      message: "Notifications cleared",
    });
  } catch (error) {
    console.error("CLEAR_NOTIFICATIONS_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications",
    });
  }
};
