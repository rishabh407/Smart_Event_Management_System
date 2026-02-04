import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
import { uploadTemplate } from "../../api/certificate.api";
import toast from "react-hot-toast";

const UploadCertificateTemplates = () => {
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState("");

  // Form data
  const [participationTemplate, setParticipationTemplate] = useState(null);
  const [winnerTemplate, setWinnerTemplate] = useState(null);

  // Text positioning for participation certificate
  const [participationPositions, setParticipationPositions] = useState({
    nameX: 400,
    nameY: 300,
    teamX: 400,
    teamY: 340,
    competitionX: 400,
    competitionY: 260,
    positionX: 400,
    positionY: 380,
    dateX: 400,
    dateY: 420,
  });

  // Text positioning for winner certificate
  const [winnerPositions, setWinnerPositions] = useState({
    nameX: 400,
    nameY: 300,
    teamX: 400,
    teamY: 340,
    competitionX: 400,
    competitionY: 260,
    positionX: 400,
    positionY: 380,
    dateX: 400,
    dateY: 420,
  });

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

  // ================= HANDLE FILE CHANGES =================

  const handleParticipationFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      setParticipationTemplate(file);
    } else {
      toast.error("Please select a PNG or JPEG image file");
      e.target.value = "";
    }
  };

  const handleWinnerFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      setWinnerTemplate(file);
    } else {
      toast.error("Please select a PNG or JPEG image file");
      e.target.value = "";
    }
  };

  // ================= HANDLE POSITION CHANGES =================

  const handleParticipationPositionChange = (field, value) => {
    setParticipationPositions((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  const handleWinnerPositionChange = (field, value) => {
    setWinnerPositions((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  // ================= UPLOAD HANDLER =================

  const handleUpload = async () => {
    if (!selectedCompetition) {
      toast.error("Please select a competition");
      return;
    }

    if (!participationTemplate || !winnerTemplate) {
      toast.error(
        "Please upload both participation and winner certificate templates",
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("competitionId", selectedCompetition);
      formData.append("participationTemplate", participationTemplate);
      formData.append("winnerTemplate", winnerTemplate);
      formData.append(
        "participationPositions",
        JSON.stringify(participationPositions),
      );
      formData.append("winnerPositions", JSON.stringify(winnerPositions));

      const res = await uploadTemplate(formData);

      toast.success("Certificate templates uploaded successfully!");
      navigate("/teacher/certificates");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Template upload failed");
    } finally {
      setUploading(false);
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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Upload Certificate Templates
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Upload PDF templates and configure text positioning for certificates
        </p>
      </div>
      {/* ================= MAIN FORM ================= */}
      <div className="bg-white rounded-lg shadow-md p-5 md:p-6">
        {/* COMPETITION SELECTION */}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Competition
          </label>
          <select
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">-- Select Competition --</option>
            {competitions.map((comp) => (
              <option key={comp._id} value={comp._id}>
                {comp.name} — {new Date(comp.startTime).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* TEMPLATES UPLOAD SECTION */}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* PARTICIPATION CERTIFICATE */}

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-green-700">
              📜 Participation Certificate
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Template Image (PNG/JPEG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleParticipationFileChange}
                className="w-full border rounded px-3 py-2"
              />
              {participationTemplate && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {participationTemplate.name}
                </p>
              )}
            </div>

            {/* TEXT POSITIONING */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Text Positioning (pixels)</h4>

              {/* Competition name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">
                    Competition X
                  </label>
                  <input
                    type="number"
                    value={participationPositions.competitionX}
                    onChange={(e) =>
                      handleParticipationPositionChange(
                        "competitionX",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Competition Y
                  </label>
                  <input
                    type="number"
                    value={participationPositions.competitionY}
                    onChange={(e) =>
                      handleParticipationPositionChange(
                        "competitionY",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Student name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Name X</label>
                  <input
                    type="number"
                    value={participationPositions.nameX}
                    onChange={(e) =>
                      handleParticipationPositionChange("nameX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Name Y</label>
                  <input
                    type="number"
                    value={participationPositions.nameY}
                    onChange={(e) =>
                      handleParticipationPositionChange("nameY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Team name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Team X</label>
                  <input
                    type="number"
                    value={participationPositions.teamX}
                    onChange={(e) =>
                      handleParticipationPositionChange("teamX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Team Y</label>
                  <input
                    type="number"
                    value={participationPositions.teamY}
                    onChange={(e) =>
                      handleParticipationPositionChange("teamY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">
                    Position X
                  </label>
                  <input
                    type="number"
                    value={participationPositions.positionX}
                    onChange={(e) =>
                      handleParticipationPositionChange(
                        "positionX",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Position Y
                  </label>
                  <input
                    type="number"
                    value={participationPositions.positionY}
                    onChange={(e) =>
                      handleParticipationPositionChange(
                        "positionY",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Date X</label>
                  <input
                    type="number"
                    value={participationPositions.dateX}
                    onChange={(e) =>
                      handleParticipationPositionChange("dateX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Date Y</label>
                  <input
                    type="number"
                    value={participationPositions.dateY}
                    onChange={(e) =>
                      handleParticipationPositionChange("dateY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* WINNER CERTIFICATE */}

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-yellow-700">
              🏆 Winner Certificate
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Template Image (PNG/JPEG)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleWinnerFileChange}
                className="w-full border rounded px-3 py-2"
              />
              {winnerTemplate && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ {winnerTemplate.name}
                </p>
              )}
            </div>

            {/* TEXT POSITIONING */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Text Positioning (pixels)</h4>

              {/* Competition name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">
                    Competition X
                  </label>
                  <input
                    type="number"
                    value={winnerPositions.competitionX}
                    onChange={(e) =>
                      handleWinnerPositionChange(
                        "competitionX",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Competition Y
                  </label>
                  <input
                    type="number"
                    value={winnerPositions.competitionY}
                    onChange={(e) =>
                      handleWinnerPositionChange(
                        "competitionY",
                        e.target.value,
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Student name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Name X</label>
                  <input
                    type="number"
                    value={winnerPositions.nameX}
                    onChange={(e) =>
                      handleWinnerPositionChange("nameX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Name Y</label>
                  <input
                    type="number"
                    value={winnerPositions.nameY}
                    onChange={(e) =>
                      handleWinnerPositionChange("nameY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Team name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Team X</label>
                  <input
                    type="number"
                    value={winnerPositions.teamX}
                    onChange={(e) =>
                      handleWinnerPositionChange("teamX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Team Y</label>
                  <input
                    type="number"
                    value={winnerPositions.teamY}
                    onChange={(e) =>
                      handleWinnerPositionChange("teamY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">
                    Position X
                  </label>
                  <input
                    type="number"
                    value={winnerPositions.positionX}
                    onChange={(e) =>
                      handleWinnerPositionChange("positionX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Position Y
                  </label>
                  <input
                    type="number"
                    value={winnerPositions.positionY}
                    onChange={(e) =>
                      handleWinnerPositionChange("positionY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600">Date X</label>
                  <input
                    type="number"
                    value={winnerPositions.dateX}
                    onChange={(e) =>
                      handleWinnerPositionChange("dateX", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">Date Y</label>
                  <input
                    type="number"
                    value={winnerPositions.dateY}
                    onChange={(e) =>
                      handleWinnerPositionChange("dateY", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleUpload}
            disabled={
              !selectedCompetition ||
              !participationTemplate ||
              !winnerTemplate ||
              uploading
            }
            className={`flex-1 py-3 rounded-lg font-medium transition
            ${
              !selectedCompetition ||
              !participationTemplate ||
              !winnerTemplate ||
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {uploading ? "Uploading..." : "📤 Upload Templates"}
          </button>

          <button
            onClick={() => navigate("/teacher/certificates")}
            className="flex-1 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ================= INFO SECTION ================= */}

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold mb-2">ℹ Important Information</h3>
        <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
          <li>
            Upload PNG/JPEG image templates for both participation and winner
            certificates
          </li>
          <li>
            Configure text positioning coordinates (X, Y) for name, position,
            and date fields
          </li>
          <li>
            Coordinates are measured in pixels from the top-left corner of the
            image
          </li>
          <li>Test positioning with sample data before finalizing</li>
          <li>Templates must be uploaded before generating certificates</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadCertificateTemplates;
