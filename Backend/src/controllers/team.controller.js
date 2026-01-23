import Team from "../models/Team.js";
import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";

export const createTeam = async (req, res) => {
  try {

    const { competitionId, teamName } = req.body;

    if (!competitionId || !teamName) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can create teams"
      });
    }

    const competition = await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found"
      });
    }

    if (competition.type !== "team") {
      return res.status(400).json({
        message: "This competition does not allow teams"
      });
    }

    if (new Date() > competition.registrationDeadline) {
      return res.status(400).json({
        message: "Registration deadline passed"
      });
    }

    // Prevent multiple teams
    const existingTeam = await Team.findOne({
      competitionId,
      members: req.user._id
    });

    if (existingTeam) {
      return res.status(400).json({
        message: "Already part of a team"
      });
    }

    // Generate unique join code
    let joinCode;
    let exists = true;

    while (exists) {
      joinCode = generateJoinCode();
      const check = await Team.findOne({ joinCode });
      if (!check) exists = false;
    }

    const team = await Team.create({
      teamName: teamName.trim(),
      joinCode,
      competitionId,
      leader: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


export const joinTeam = async (req, res) => {

  try {

    const { joinCode } = req.body;

    if (!joinCode) {
      return res.status(400).json({
        message: "Join code required"
      });
    }

    const cleanCode = joinCode.trim().toUpperCase();

    const team = await Team.findOne({ joinCode: cleanCode });

    if (!team) {
      return res.status(404).json({
        message: "Invalid team code"
      });
    }

    if (team.isSubmitted) {
      return res.status(400).json({
        message: "Team already submitted"
      });
    }

    const competition = await Competition.findById(team.competitionId);

    if (!competition) {
      return res.status(404).json({
        message: "Competition not found"
      });
    }

    if (new Date() > competition.registrationDeadline) {
      return res.status(400).json({
        message: "Registration deadline passed"
      });
    }

    const alreadyRegistered = await Registration.findOne({
      student: req.user._id,
      competition: team.competitionId,
      status: { $ne: "cancelled" }
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "Already registered individually"
      });
    }

    const alreadyMember = team.members.some(
      id => id.toString() === req.user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "Already in this team"
      });
    }

    if (
      competition.maxTeamSize &&
      team.members.length >= competition.maxTeamSize
    ) {
      return res.status(400).json({
        message: "Team is full"
      });
    }

    await Team.findByIdAndUpdate(team._id, {
      $push: { members: req.user._id }
    });

    res.status(200).json({
      success: true,
      message: "Joined team successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

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

export const getMyTeams = async (req, res) => {

  try {

    const { competitionId } = req.params;

    const teams = await Team.find({
      competitionId,
      members: req.user._id
    })
      .populate("members", "fullName")
      .populate("leader", "fullName");

    res.status(200).json({
      success: true,
      data: teams
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


export const getTeamsByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
    const teams = await Team.find({
      members: userId
    })
      .populate("members", "fullName")
      .populate("leader", "fullName")
      .populate("competitionId", "name registrationDeadline")
      .sort({ createdAt: -1 });
      // if we use -1 then we see the newest records . And if we write 1 then we see the oldest records.
    res.status(200).json({
      success: true,
      datateams: teams
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// =====================
// JOIN CODE GENERATOR
// =====================

const generateJoinCode = () => {

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};