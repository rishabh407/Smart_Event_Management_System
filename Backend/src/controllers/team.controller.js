import Team from "../models/Team.js";
import Competition from "../models/Competition.js";

// ============================
// CREATE TEAM (Student Leader)
// ============================

export const createTeam = async (req, res) => {
  try {
    const { competitionId, teamName } = req.body;

    if (!competitionId || !teamName) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can create teams",
      });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    if (competition.type !== "team") {
      return res.status(400).json({
        message: "This competition does not allow teams",
      });
    }

    // Check already in team for this competition
    const existingTeam = await Team.findOne({
      competitionId,
      members: req.user._id,
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Already part of a team in this competition",
      });
    }

    const team = await Team.create({
      teamName: teamName.trim(),
      competitionId,
      leader: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// JOIN TEAM
// ============================

export const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "Team ID required" });
    }

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can join teams",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.isSubmitted) {
      return res.status(400).json({
        message: "Team already submitted",
      });
    }

    // Prevent duplicate join
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({
        message: "Already in this team",
      });
    }

    const competition = await Competition.findById(team.competitionId);

    // Max team size check
    if (competition.maxTeamSize) {
      if (team.members.length >= competition.maxTeamSize) {
        return res.status(400).json({
          message: "Team is full",
        });
      }
    }

    team.members.push(req.user._id);
    await team.save();

    res.json({
      message: "Joined team successfully",
      team,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// LEAVE TEAM
// ============================

export const leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "teamId required" });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.isSubmitted) {
      return res.status(400).json({
        message: "Cannot leave team after submission",
      });
    }

    // Leader cannot leave
    if (team.leader.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "Leader cannot leave team. Delete team instead.",
      });
    }

    if (!team.members.includes(req.user._id)) {
      return res.status(400).json({
        message: "You are not part of this team",
      });
    }

    team.members = team.members.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await team.save();

    res.json({
      message: "Left team successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================
// DELETE TEAM (Leader)
// ============================

export const deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: "teamId required" });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only team leader can delete team",
      });
    }

    if (team.isSubmitted) {
      return res.status(400).json({
        message: "Cannot delete team after submission",
      });
    }

    await Team.findByIdAndDelete(teamId);

    res.json({
      message: "Team deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
