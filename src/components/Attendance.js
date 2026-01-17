import { useState } from "react";
import { FaArrowLeft, FaSatelliteDish } from "react-icons/fa";
import "./Attendance.css";


function Attendance({ className, setView }) {
  const totalStudents = 60;

  const [mode, setMode] = useState("present");
  const [attendance, setAttendance] = useState(
    Array(totalStudents).fill("present")
  );
  const [radarActive, setRadarActive] = useState(false);
  const [radarDone, setRadarDone] = useState(false);
  const [showPopup, setShowPopup] = useState(false);


  // Toggle attendance manually
  const toggleAttendance = (index) => {
    const updated = [...attendance];
    updated[index] = mode;
    setAttendance(updated);
  };

  // Start radar
  const handleRadarAttendance = () => {
    setRadarActive(true);
    setRadarDone(false);

    setTimeout(() => {
      setAttendance(Array(totalStudents).fill("present"));
      setRadarDone(true);
    }, 2500);
  };

  // Submit attendance
  const handleRadarSubmit = () => {
    console.log("Final Attendance:", attendance);
    setRadarActive(false);
    setShowPopup(true);
  };

  return (
    <div className="attendance-page">
      {/* Header */}
      <header className="attendance-header">
        <FaArrowLeft
        className="back-arrow"
        onClick={() => setView("teacher-radar")}
        />

        <span>{className} - Attendance</span>
        <FaSatelliteDish
          className="radar-icon"
          onClick={handleRadarAttendance}
        />
      </header>

      {/* Radar Overlay */}
      {radarActive && (
        <div className="radar-overlay">
          <div className="radar-circle">
            <div className="radar-sweep"></div>
          </div>

          {radarDone && (
            <button
              className="radar-submit-btn"
              onClick={handleRadarSubmit}
            >
              Submit Attendance
            </button>
          )}
        </div>
      )}

      {/* Mode Switch */}
      <div className="mode-switch">
        <button
          className={mode === "present" ? "active" : ""}
          onClick={() => setMode("present")}
        >
          Present
        </button>
        <button
          className={mode === "absent" ? "active absent" : ""}
          onClick={() => setMode("absent")}
        >
          Absent
        </button>
      </div>

      {/* Student Grid */}
      <div className="student-grid">
        {attendance.map((status, index) => (
          <div
            key={index}
            className={`student-box ${status}`}
            onClick={() => toggleAttendance(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>✅ Attendance Completed</h2>
            <p>Attendance has been submitted successfully.</p>
            <button
              className="popup-btn"
              onClick={() => {
                setShowPopup(false);
                setView("teacher-dash");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Footer Submit Button */}
      <div className="attendance-footer">
        <button
          className="footer-submit-btn"
          onClick={handleRadarSubmit}
          disabled={!radarDone}
        >
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default Attendance;