import { v4 as uuidv4 } from "uuid";
import Team from "../models/Team.js";
import Competition from "../models/Competition.js";
import Registration from "../models/Registration.js";

/**
 * CREATE TEAM
 */
export const createTeam = async (req, res) => {
  const { competitionId, teamName } = req.body;

  if (!competitionId || !teamName) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  // Check competition exists
  const competition = await Competition.findOne({ competitionId });

  if (!competition) {
    return res.status(404).json({ message: "Competition not found" });
  }

  // Check team allowed
if (competition.type !== "team") {
  return res
    .status(400)
    .json({ message: "This competition does not allow teams" });
}

// Check duplicate team name in same competition
const existingTeamName = await Team.findOne({
  competitionId,
  teamName: teamName.trim()
});

if (existingTeamName) {
  return res.status(400).json({
    message: "Team name already exists in this competition"
  });
}

  // Check user already in team
  const existingTeam = await Team.findOne({
    competitionId,
    members: req.user.userId
  });

  if (existingTeam) {
    return res
      .status(400)
      .json({ message: "Already part of a team" });
  }

  // Create team
  const team = await Team.create({
    teamId: uuidv4(),
    teamName: teamName.trim(),
    competitionId,
    leaderId: req.user.userId,
    members: [req.user.userId]
  });

  res.status(201).json({
    message: "Team created successfully",
    team
  });
};

/**
 * JOIN TEAM
 */

export const joinTeam = async (req, res) => {
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({ message: "Team ID required" });
  }

  const team = await Team.findOne({ teamId });

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Prevent duplicate join
  if (team.members.includes(req.user.userId)) {
    return res.status(400).json({ message: "Already in team" });
  }

  // Competition rules
  const competition = await Competition.findOne({
    competitionId: team.competitionId
  });

  if (competition.maxTeamSize) {
    if (team.members.length >= competition.maxTeamSize) {
      return res.status(400).json({ message: "Team is full" });
    }
  }

  team.members.push(req.user.userId);
  await team.save();

  res.json({
    message: "Joined team successfully",
    team
  });
};

/**
 * LEAVE TEAM
 */
export const leaveTeam = async (req, res) => {
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({ message: "teamId required" });
  }

  const team = await Team.findOne({ teamId });

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Leader cannot leave — must delete team
  if (team.leaderId === req.user.userId) {
    return res.status(400).json({
      message: "Team leader cannot leave. Delete team instead."
    });
  }

  // Check membership
  if (!team.members.includes(req.user.userId)) {
    return res.status(400).json({
      message: "You are not a member of this team"
    });
  }

//  Cannot leave team after registeration.
  const registeredTeam = await Registration.findOne({
  teamId: teamId
});

if (registeredTeam) {
  return res.status(400).json({
    message: "Cannot leave team after registration"
  });
}  

  // Remove member
  team.members = team.members.filter(
    id => id !== req.user.userId
  );

  await team.save();

  res.json({
    message: "Left team successfully"
  });
};


/**
 * DELETE TEAM (Leader Only)
 */
export const deleteTeam = async (req, res) => {
  const { teamId } = req.body;

  if (!teamId) {
    return res.status(400).json({ message: "teamId required" });
  }

  const team = await Team.findOne({ teamId });

  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Authorization check
  if (team.leaderId !== req.user.userId) {
    return res.status(403).json({
      message: "Only team leader can delete team"
    });
  }
// Cannot delete team after registeration 
  const registeredTeam = await Registration.findOne({
  teamId: teamId
});

if (registeredTeam) {
  return res.status(400).json({
    message: "Cannot delete team after registration"
  });
}
 
  await Team.deleteOne({ teamId });

  res.json({
    message: "Team deleted successfully"
  });
};
