import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompetitionById } from "../../api/competition.api";
import IndividualRegistration from "./IndividualRegisteration";
import TeamRegistration from "./TeamRegisteration";

const CompetitionRegistration = () => {

  const { competitionId } = useParams();

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const res = await getCompetitionById(competitionId);
        setCompetition(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

    };

    fetchCompetition();

  }, [competitionId]);

  if (loading) return <p>Loading...</p>;

  if (!competition) return <p>Competition not found</p>;

  return (
    <div>

      <h1 className="text-xl font-bold">
        {competition.name}
      </h1>

      <p>{competition.shortDescription}</p>

      {/* Conditional UI */}

      {competition.type === "individual" ? (
        <IndividualRegistration competitionId={competition._id} />
      ) : (
        <TeamRegistration competition={competition} />
      )}

    </div>
  );
};

export default CompetitionRegistration;
