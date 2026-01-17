import React, { useEffect, useState } from "react";
import {
  FaSatelliteDish,
  FaBell,
  FaHome,
  FaCalendarAlt,
  FaClipboardList,
  FaUserAlt,
  FaTimes
} from "react-icons/fa";
import { supabase } from "../supabaseClient";
import "./Home.css";

function Home({ setView }) {
const [count, setCount] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const { data } = await supabase.from("attendance").select("*");
      setAttendanceData(data || []);
      setLoading(false);
    };
    fetchAttendanceData();
  }, []);

  const overallAttendance =
    attendanceData.length > 0
      ? (
          attendanceData.reduce(
            (acc, item) => acc + item.attendance_percentage,
            0
          ) / attendanceData.length
        ).toFixed(1)
      : 0;

  return (
    <div className="home-container">
      {/* HEADER */}
      <header className="home-header">
        <div className="header-text">Hi Coder 👋</div>
        <div className="header-icons">
          <FaSatelliteDish
            className="icon"
            onClick={() => {
    setCount(count + 1);
    setView("radar");
  }}
          />
          <div className="bell-wrapper">
            <FaBell className="icon" />
            <span className="badge">30</span>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h2>Total lectures attended</h2>
          <p>{attendanceData.length}</p>
        </div>

        <div className="stat-card">
          <h2>Total subjects</h2>
          <p>{attendanceData.length}</p>
        </div>

        <div className="stat-card">
          <h2>Total days of college</h2>
          <p>34</p>
        </div>
      </div>

      {/* ATTENDANCE */}
      <div className="attendance-card">
        <h3>
          {loading
            ? "Loading..."
            : `${overallAttendance}%Overall Attendance`}
        </h3>

        {!loading &&
          attendanceData.map((subject) => (
            <div
              key={subject.id}
              className={`subject-row ${
                subject.attendance_percentage < 75 ? "danger" : ""
              }`}
            >
              <span>{subject.subject_name}</span>
              <strong>{subject.attendance_percentage}%</strong>
            </div>
          ))}
      </div>

      {/* BOTTOM NAV */}
      <footer className="bottom-nav">
        <div className="nav-item active">
          <FaHome />
          <span>Home</span>
        </div>

        <div className="nav-item" onClick={() => setView("schedule")}>
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

        <div
          className="nav-item"
          onClick={() => setShowProfileSidebar(true)}
        >
          <FaUserAlt />
          <span>Profile</span>
        </div>
      </footer>

      {/* PROFILE SIDEBAR */}
      {showProfileSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setShowProfileSidebar(false)}
        />
      )}

      <div className={`profile-sidebar ${showProfileSidebar ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Profile</h3>
          <FaTimes onClick={() => setShowProfileSidebar(false)} />
        </div>

        <div className="sidebar-content">
          <p><strong>Name:</strong> Coder</p>
          <p><strong>Email:</strong> user@email.com</p>
          <button className="sidebar-btn logout">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default Home;