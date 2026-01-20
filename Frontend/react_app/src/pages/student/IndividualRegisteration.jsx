import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerIndividual } from "../../api/registeration.api";
const IndividualRegistration = ({ competitionId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerIndividual({ competitionId });
      // Redirect to my registrations page
      navigate("/student/registrations");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      disabled={loading}
      onClick={handleRegister}
      className={`px-4 py-2 rounded text-white 
        ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
      `}
    >
      {loading ? "Registering..." : "Register Individually"}
    </button>
  );
};
export default IndividualRegistration;
