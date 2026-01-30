import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerIndividual } from "../../api/registeration.api";
import toast from "react-hot-toast";

const IndividualRegistration = ({ competitionId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerIndividual({ competitionId });
      toast.success("Registration successful! 🎉");
      navigate("/student/registrations");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Individual Registration</h3>
        <p className="text-sm text-blue-800">
          You will be registered as an individual participant for this competition.
        </p>
      </div>

      <button
        disabled={loading}
        onClick={handleRegister}
        className={`w-full py-3 px-6 rounded-lg font-medium transition shadow-md hover:shadow-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Registering...
          </span>
        ) : (
          "✅ Register Individually"
        )}
      </button>
    </div>
  );
};

export default IndividualRegistration;
