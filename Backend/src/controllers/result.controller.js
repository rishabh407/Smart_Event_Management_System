// import { v4 as uuidv4 } from "uuid";
// import Result from "../models/Result.js";
// import Competition from "../models/Competition.js";

// /**
//  * DECLARE RESULTS
//  */
// export const declareResults = async (req, res) => {
//   const { competitionId, winners } = req.body;

//   if (!competitionId || !winners || winners.length === 0) {
//     return res.status(400).json({
//       message: "Invalid result data"
//     });
//   }

//   const competition = await Competition.findOne({ competitionId });

//   if (!competition) {
//     return res.status(404).json({
//       message: "Competition not found"
//     });
//   }

//   const savedResults = [];

//   for (const winner of winners) {
//     const result = await Result.create({
//       resultId: uuidv4(),
//       competitionId,
//       participantId: winner.participantId,
//       type: winner.type,
//       position: winner.position
//     });

//     savedResults.push(result);
//   }

//   res.status(201).json({
//     message: "Results declared successfully",
//     results: savedResults
//   });
// };


import { v4 as uuidv4 } from "uuid";
import Result from "../models/Result.js";
import Competition from "../models/Competition.js";

export const declareResults = async (req, res) => {

  const { competitionId, winners } = req.body;

  if (!competitionId || !winners || winners.length === 0) {
    return res.status(400).json({
      message: "Invalid result data"
    });
  }

  // Fetch competition
  const competition = await Competition.findOne({ competitionId });

  if (!competition) {
    return res.status(404).json({
      message: "Competition not found"
    });
  }

  // Auto decide result type
  const resultType =
    competition.type === "team"
      ? "team"
      : "student";

  const savedResults = [];

  for (const winner of winners) {

    if (!winner.participantId || !winner.position) {
      return res.status(400).json({
        message: "ParticipantId and position required"
      });
    }

    const result = await Result.create({
      resultId: uuidv4(),
      competitionId,
      participantId: winner.participantId,
      type: resultType,
      position: winner.position
    });

    savedResults.push(result);
  }

  res.status(201).json({
    message: "Results declared successfully",
    results: savedResults
  });
};
