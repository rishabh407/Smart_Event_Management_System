import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerIndividual } from "../../api/registeration.api";
import toast from "react-hot-toast";

const IndividualRegistration = ({ competitionId }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {

    if (loading) return;

    try {

      setLoading(true);

      await registerIndividual({ competitionId });

      toast.success("Registration successful! 🎉");

      navigate("/student/registrations");

    } catch (error) {

      console.error("Registration error:", error);

      toast.error(
        error.response?.data?.message || "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="space-y-4">

      {/* INFO BOX */}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">

        <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
          Individual Registration
        </h3>

        <p className="text-xs sm:text-sm text-blue-800">
          You will be registered as an individual participant for this competition.
        </p>

      </div>

      {/* REGISTER BUTTON */}

      <button
        disabled={loading}
        onClick={handleRegister}
        aria-busy={loading}
        className={`w-full py-3 px-5 sm:px-6 rounded-lg font-medium transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
          loading
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >

        {loading ? (

          <span className="flex items-center justify-center text-sm sm:text-base">

            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>

            Registering...

          </span>

        ) : (

          <span className="text-sm sm:text-base">
            ✅ Register Individually
          </span>

        )}

      </button>

    </div>
  );
};

export default IndividualRegistration;
