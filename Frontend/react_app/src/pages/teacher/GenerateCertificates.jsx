import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { generateCertificates } from "../../api/certificate.api";
import toast from "react-hot-toast";

const GenerateCertificates = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState("");

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getinchargeteacherscompetitions();
      setCompetitions(res.data);
    } catch (error) {
      console.error("Error fetching competitions:", error);
      toast.error("Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleGenerate = async () => {
    if (!selectedCompetition) {
      toast.error("Please select a competition");
      return;
    }

    const confirm = window.confirm(
      "Are you sure you want to generate certificates for this competition? This action cannot be undone."
    );

    if (!confirm) return;

    try {
      setGenerating(true);
      const res = await generateCertificates(selectedCompetition);
      toast.success(`Successfully generated ${res.data.generated} certificates!`);
      setSelectedCompetition("");
    } catch (error) {
      console.error("Error generating certificates:", error);
      toast.error(error.response?.data?.message || "Failed to generate certificates");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Generate Certificates</h1>
        <p className="text-gray-600 mt-1">
          Generate participation and winner certificates for completed competitions
        </p>
      </div>

      {/* ================= MAIN CARD ================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* SELECT COMPETITION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Competition
            </label>
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choose a competition --</option>
              {competitions
                .filter((comp) => {
                  const now = new Date();
                  return new Date(comp.endTime) < now;
                })
                .map((comp) => (
                  <option key={comp._id} value={comp._id}>
                    {comp.name} - {new Date(comp.endTime).toLocaleDateString()}
                  </option>
                ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Only completed competitions are shown
            </p>
          </div>

          {/* SELECTED COMPETITION INFO */}
          {selectedCompetition && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              {(() => {
                const comp = competitions.find((c) => c._id === selectedCompetition);
                if (!comp) return null;
                return (
                  <div>
                    <h3 className="font-semibold text-indigo-900 mb-2">{comp.name}</h3>
                    <div className="text-sm text-indigo-700 space-y-1">
                      <p><strong>Type:</strong> {comp.type}</p>
                      <p><strong>Venue:</strong> {comp.venue}</p>
                      <p>
                        <strong>Ended:</strong> {new Date(comp.endTime).toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-indigo-600">
                        Certificates will be generated for all students who attended this competition.
                        Winners will receive winner certificates, others will receive participation certificates.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* GENERATE BUTTON */}
          <div className="flex gap-4">
            <button
              onClick={handleGenerate}
              disabled={!selectedCompetition || generating}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
                !selectedCompetition || generating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {generating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </span>
              ) : (
                "🎓 Generate Certificates"
              )}
            </button>
            <button
              onClick={() => navigate("/teacher/dashboard")}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ================= INFO SECTION ================= */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Important Information</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Certificates can only be generated for completed competitions</li>
          <li>Only students who marked attendance will receive certificates</li>
          <li>Winners (1st, 2nd, 3rd place) will receive winner certificates</li>
          <li>All other participants will receive participation certificates</li>
          <li>Each student can only receive one certificate per competition</li>
        </ul>
      </div>
    </div>
  );
};

export default GenerateCertificates;
