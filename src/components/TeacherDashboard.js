import "./Teacher.css";

import {
  FaSatelliteDish,
  FaBell,
  FaHome,
  FaCalendarAlt,
  FaClipboardList,
  FaUserAlt,
  FaNewspaper,
  FaClock,
  FaCalendarDay,
  FaFileAlt,
} from "react-icons/fa";

function TeacherDashboard({ setView }) {

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-text">Hi Coder</div>
        <div className="header-icons">
          <FaSatelliteDish
            className="icon"
            onClick={() => setView("teacher-radar")}
          />
          <div className="bell-wrapper">
            <FaBell className="icon" />
            <span className="badge">30</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="body-content">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="icon-btn">
            <FaClipboardList className="qa-icon" />
            <span>Syllabus</span>
          </button>

          <button className="icon-btn">
            <FaNewspaper className="qa-icon" />
            <span>Notice</span>
          </button>

          <button className="icon-btn">
            <FaBell className="qa-icon" />
            <span>Notification</span>
          </button>

          <button className="icon-btn">
            <FaCalendarAlt className="qa-icon" />
            <span>Notes</span>
          </button>
        </div>

        {/* Summary */}
        <div className="summary-card">
          <div className="summary-item">
            <strong>9</strong>
            <span>Total Subjects</span>
          </div>
          <div className="summary-item">
            <strong>169</strong>
            <span>Total Students</span>
          </div>
          <div className="summary-item">
            <strong>62</strong>
            <span>Total Lectures</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-card">
          <FaClock className="info-icon" />
          <div className="info-text">
            <strong>3720</strong>
            <span>Total minutes of teaching</span>
          </div>
        </div>

        <div className="info-card">
          <FaCalendarDay className="info-icon" />
          <div className="info-text">
            <strong>29</strong>
            <span>Total days of work</span>
          </div>
        </div>

        <div className="info-card">
          <FaFileAlt className="info-icon" />
          <div className="info-text">
            <strong>0</strong>
            <span>Total Notes Uploaded</span>
          </div>
        </div>

        {/* Attendance */}
        <div className="attendance-section">
          <div className="attendance-header">
            <strong>69.25%</strong>
            <span>Overall Attendance</span>
          </div>

          <div className="attendance-row">
            <span>FYBSC IT - OOP PRACTICAL BATCH 1</span>
            <strong>81.31%</strong>
          </div>

          <div className="attendance-row">
            <span>TYBSC IT - BI & DA PRACTICAL BATCH 1</span>
            <strong>78.67%</strong>
          </div>

          <div className="attendance-row">
            <span>FYBSC IT - OOP PRACTICAL BATCH 2</span>
            <strong>71.18%</strong>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <footer className="bottom-nav">
        <div className="nav-item active" onClick={() => setView("teacher-dash")}>
          <FaHome />
          <span>Home</span>
        </div>
        <div className="nav-item" onClick={() => setView("teacher-radar")}>
          <FaCalendarAlt />
          <span>Schedule</span>
        </div>
        <div className="nav-item" onClick={() => setView("attendance")}>
          <FaClipboardList />
          <span>Attendance</span>
        </div>
        <div className="nav-item">
          <FaBell />
          <span>Notice</span>
        </div>
        <div className="nav-item">
          <FaUserAlt />
          <span>Profile</span>
        </div>
      </footer>
    </div>
  );
}

export default TeacherDashboard;