import React from "react";
import { FaClipboardList } from "react-icons/fa";
import "../Teacherradar.css";

function Teacherradar({ setView, setSelectedClass }) {

    const handleNavigation = (className) => {
        setSelectedClass(className);
        setView("attendance");
    };

    return (
        <div className="radar-container">
            <header className="radar-header">
                <h1>Every Class Radar </h1>
                <button className="back-btn" onClick={() => setView("teacher-dash")}>
                    Go Back Home
                </button>
            </header>

            <main className="radar-body">
                <div className="verification-card">
                    <FaClipboardList size={50} className="verification-icon" />
                    <h3>FYIT Attendance</h3>
                    <button className="verify-btn" onClick={() => handleNavigation("FYIT")}>Track Attendance</button>
                </div>

                <div className="verification-card">
                    <FaClipboardList size={50} className="verification-icon" />
                    <h3>SYIT Attendance</h3>
                    <button className="verify-btn" onClick={() => handleNavigation("SYIT")}>Track Attendance</button>
                </div>

                <div className="verification-card">
                    <FaClipboardList size={50} className="verification-icon" />
                    <h3>TYIT Attendance</h3>
                    <button className="verify-btn" onClick={() => handleNavigation("TYIT")}>Track Attendance</button>
                </div>

            </main>
        </div>
    );
}

export default Teacherradar;