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

    const competition = competitions.find(
      c => c._id === selectedCompetition
    );

    if (competition?.certificatesGenerated) {
      toast.error("Certificates already generated for this competition");
      return;
    }

    const confirm = window.confirm(
      "Certificates can be generated only ONCE. Continue?"
    );

    if (!confirm) return;

    try {
      setGenerating(true);

      const res = await generateCertificates(selectedCompetition);

      toast.success(
        `🎉 ${res.data.generated || 0} certificates generated successfully`
      );

      // Update UI locally (no refetch needed)
      setCompetitions(prev =>
        prev.map(c =>
          c._id === selectedCompetition
            ? { ...c, certificatesGenerated: true }
            : c
        )
      );

      setSelectedCompetition("");

    } catch (error) {

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
        <p className="text-gray-600 animate-pulse">
          Loading competitions...
        </p>
      </div>
    );
  }

  // ================= COMPLETED FILTER =================

  const completedCompetitions = competitions.filter(
    comp => new Date(comp.endTime) < new Date()
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">

      {/* HEADER */}

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Generate Certificates
      </h1>

      <p className="text-gray-600 mb-6">
        Certificates can be generated only once per competition
      </p>

      {/* MAIN CARD */}

      <div className="bg-white rounded-lg shadow p-6">

        {/* DROPDOWN */}

        <label className="block text-sm font-medium mb-2">
          Select Completed Competition
        </label>

        <select
          value={selectedCompetition}
          onChange={(e) => setSelectedCompetition(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        >
          <option value="">
            -- Select Competition --
          </option>

          {completedCompetitions.map(comp => (
            <option
              key={comp._id}
              value={comp._id}
              disabled={comp.certificatesGenerated}
            >
              {comp.name}
              {comp.certificatesGenerated
                ? " (Certificates Generated)"
                : ""}
            </option>
          ))}

        </select>

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row gap-4 mt-6">

          <button
            onClick={handleGenerate}
            disabled={!selectedCompetition || generating}
            className={`flex-1 py-3 rounded-lg font-medium
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
            className="flex-1 py-3 rounded-lg border"
          >
            Cancel
          </button>

        </div>

      </div>

      {/* INFO */}

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">

        <h3 className="font-semibold mb-2">
          ⚠ Important Rules
        </h3>

        <ul className="text-sm list-disc list-inside space-y-1">
          <li>Certificates are generated only once</li>
          <li>Duplicate generation is blocked</li>
          <li>Only attended participants receive certificates</li>
          <li>Winners get winner certificates</li>
        </ul>

      </div>

    </div>
  );
};

export default GenerateCertificates;
