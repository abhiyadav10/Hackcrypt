import { useEffect, useState } from "react";
import { User, Users, GraduationCap } from "lucide-react";
import "./App.css";

function Dashboard({ setView }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="page-wrapper">
      {showIntro ? (
        <div className="intro-container">
          <div className="logo-box">
            <GraduationCap className="logo-icon" />
          </div>
          <h1 className="intro-title">EduSphere</h1>
        </div>
      ) : (
        <div className="main-card">
          <div className="header">
            <GraduationCap className="header-logo" />
            <h1>EduSphere</h1>
            <p>Student Attendance Management</p>
          </div>

          <div className="sections">
            {/* STUDENT */}
            <div className="card">
              <User className="icon student" />
              <h2>Student</h2>
              <p>View attendance and reports</p>
              <button onClick={() => setView("student-auth")}>
                Student Login
              </button>
            </div>

            {/* TEACHER */}
            <div className="card">
              <Users className="icon teacher" />
              <h2>Teacher</h2>
              <p>Mark and manage attendance</p>
              <button
                className="teacher-btn"
                onClick={() => setView("teacher-auth")}
              >
                Teacher Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
