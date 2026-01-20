import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompetitionsByEvent } from "../../api/competition.api";
import { useNavigate } from "react-router-dom";

const Competitions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(eventId);
  const fetchCompetitions = async () => {
    try {
      const res = await getCompetitionsByEvent(eventId);
      console.log(res.data);
      setCompetitions(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, [eventId]);


  if (loading) {
    return <div className="text-center mt-10">Loading competitions...</div>;
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Competitions
      </h1>

      {competitions.length === 0 && (
        <p className="text-gray-500">
          No competitions available
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {competitions.map((comp) => (

          <div
            key={comp._id}
            className="bg-white p-4 rounded shadow hover:shadow-lg transition"
          >

            <h2 className="text-lg font-semibold">
              {comp.name}
            </h2>

            <p className="text-sm text-gray-600">
              {comp.shortDescription}
            </p>

            <div className="mt-2 text-sm text-gray-500 space-y-1">

              <p>
                📌 Type: {comp.type}
              </p>

              <p>
                📍 Venue: {comp.venue}
              </p>

              <p>
                ⏳ Deadline:{" "}
                {new Date(comp.registrationDeadline).toLocaleDateString()}
              </p>

            </div>
<button
  onClick={() =>
    navigate(`/student/events/${eventId}/competitions/${comp._id}/register`)
  }
  className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
>
  Register
</button>
          </div>

        ))}

      </div>

    </div>
  );
};

export default Competitions;
