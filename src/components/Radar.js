import React from "react";
import { FaFingerprint, FaUserCheck, FaSmile } from "react-icons/fa";
import "./Radar.css";
import ScanQR from "./ScanQr"; // Import your QR scanning component
import { useState } from "react";


function Radar({ setView, userRole }) {
  const backView = userRole === "teacher" ? "teacher-dash" : "student-dash";
  const [view, setRadarView] = useState("verification");
  const [idVerified, setIdVerified] = useState(false);


    const handleVerified = () => {
    setIdVerified(true);
    setRadarView("verified"); // explicit state
  };

  return (
    <div className="radar-container">
      <header className="radar-header">
        <h1>Radar Verification</h1>
        <button className="back-btn" onClick={() => setView(backView)}>
          Go Back Home
        </button>
      </header>

      <main className="radar-body">
        <div className="verification-card">
          <FaFingerprint size={50} className="verification-icon" />
          <h3>Fingerprint Verification</h3>
          <p>Simulate fingerprint scan to verify identity.</p>
          <button
            className="verify-btn"
            onClick={() => alert("Fingerprint Verified!")}
          >
            Verify Fingerprint
          </button>
        </div>

        <div className="verification-card">
          <FaSmile size={50} className="verification-icon" />
          <h3>Face Verification</h3>
          <p>Simulate facial recognition verification.</p>
          <button
            className="verify-btn"
            onClick={() => setView("face-attendance")}
          >
            Verify Face
          </button>
        </div>

        <div className="verification-card">
          <FaUserCheck size={50} className="verification-icon" />
          <h3>ID Verification</h3>
          <p>Verify using student ID or official document.</p>

          {!idVerified && view === "verification" && (
            <button
              className="verify-btn"
              onClick={() => setRadarView("scan")}
            >
              Verify ID
            </button>
          )}

          {view === "scan" && !idVerified && (
            <ScanQR setView={setRadarView} onVerified={handleVerified} />
          )}

          {idVerified && (
            <p>ID has been verified!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Radar;
