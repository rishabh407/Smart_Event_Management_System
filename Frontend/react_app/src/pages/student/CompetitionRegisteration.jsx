import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionById } from "../../api/competition.api";
import IndividualRegistration from "./IndividualRegisteration";
import TeamRegistration from "./TeamRegisteration";
import toast from "react-hot-toast";

const CompetitionRegistration = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        const res = await getCompetitionById(competitionId);
        setCompetition(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load competition");
        navigate("/student/events");
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competition...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Competition not found</p>
        <button
          onClick={() => navigate("/student/events")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const now = new Date();
  const regDeadline = new Date(competition.registrationDeadline);
  const isRegistrationOpen = now < regDeadline && competition.registrationOpen;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{competition.name}</h1>
        <p className="text-gray-600 mt-2">{competition.shortDescription}</p>
      </div>

      {/* ================= COMPETITION DETAILS CARD ================= */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Competition Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Type</p>
            <p className="font-medium capitalize">{competition.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Venue</p>
            <p className="font-medium">{competition.venue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Time</p>
            <p className="font-medium">{new Date(competition.startTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Time</p>
            <p className="font-medium">{new Date(competition.endTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Registration Deadline</p>
            <p className="font-medium">{new Date(competition.registrationDeadline).toLocaleString()}</p>
          </div>
          {competition.maxParticipants && (
            <div>
              <p className="text-sm text-gray-600">Max Participants</p>
              <p className="font-medium">{competition.maxParticipants}</p>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="mt-4">
          {isRegistrationOpen ? (
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium">
              ✅ Registration Open
            </span>
          ) : (
            <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium">
              ❌ Registration Closed
            </span>
          )}
        </div>
      </div>

      {/* ================= REGISTRATION FORM ================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {competition.type === "individual" ? (
          <IndividualRegistration competitionId={competition._id} />
        ) : (
          <TeamRegistration competition={competition} />
        )}
      </div>
    </div>
  );
};

export default CompetitionRegistration;
