import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
import { generateCertificates } from "../../api/certificate.api";
import toast from "react-hot-toast";

const GenerateCertificates = () => {

  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState("");

  // ================= FETCH ASSIGNED COMPETITIONS =================

  const fetchCompetitions = async () => {

    try {

      setLoading(true);

      const res = await getAllAssignedCompetitions();

      setCompetitions(res.data || []);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load competitions");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  // ================= GENERATE HANDLER =================

  const handleGenerate = async () => {

    if (!selectedCompetition) {
      toast.error("Please select a competition");
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to generate certificates? This action cannot be undone."
    );

    if (!confirm) return;

    try {

      setGenerating(true);

      const res = await generateCertificates(selectedCompetition);

      toast.success(`🎉 ${res.data.generated || 0} certificates generated successfully`);

      setSelectedCompetition("");

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Certificate generation failed"
      );

    } finally {

      setGenerating(false);

    }
  };

  // ================= LOADING UI =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[350px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  // ================= COMPLETED COMP FILTER =================

  const completedCompetitions = competitions.filter((comp) => {
    const now = new Date();
    return new Date(comp.endTime) < now;
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">

      {/* ================= HEADER ================= */}

      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Generate Certificates
        </h1>

        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Generate participation and winner certificates for completed competitions
        </p>

      </div>

      {/* ================= MAIN CARD ================= */}

      <div className="bg-white rounded-lg shadow-md p-5 md:p-6">

        {/* SELECT DROPDOWN */}

        <div className="mb-5">

          <label className="block text-sm font-medium mb-2">
            Select Completed Competition
          </label>

          <select
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">
              -- Select Competition --
            </option>

            {completedCompetitions.map((comp) => (
              <option key={comp._id} value={comp._id}>
                {comp.name} — {new Date(comp.endTime).toLocaleDateString()}
              </option>
            ))}

          </select>

          {completedCompetitions.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No completed competitions available
            </p>
          )}

        </div>

        {/* SELECTED INFO CARD */}

        {selectedCompetition && (

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-5">

            {(() => {

              const comp = competitions.find(
                c => c._id === selectedCompetition
              );

              if (!comp) return null;

              return (

                <>
                  <h3 className="font-semibold mb-1">
                    {comp.name}
                  </h3>

                  <p className="text-sm text-indigo-700">
                    📍 {comp.venue}
                  </p>

                  <p className="text-sm text-indigo-700">
                    🕒 Ended: {new Date(comp.endTime).toLocaleString()}
                  </p>

                </>

              );

            })()}

          </div>

        )}

        {/* ACTION BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-4">

          <button
            onClick={handleGenerate}
            disabled={!selectedCompetition || generating}
            className={`flex-1 py-3 rounded-lg font-medium transition
            ${
              !selectedCompetition || generating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >

            {generating ? "Generating..." : "🎓 Generate Certificates"}

          </button>

          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="flex-1 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

        </div>

      </div>

      {/* ================= INFO SECTION ================= */}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">

        <h3 className="font-semibold mb-2">
          ℹ Important Information
        </h3>

        <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">

          <li>Only completed competitions are allowed</li>
          <li>Only attended students receive certificates</li>
          <li>Winners receive winner certificates</li>
          <li>Others receive participation certificates</li>
          <li>Each student gets only ONE certificate</li>

        </ul>

      </div>

    </div>
  );
};

export default GenerateCertificates;
 