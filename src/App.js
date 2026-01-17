import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import StudentAuth from "./components/StudentAuth";
import TeacherAuth from "./components/TeacherAuth";
import StudentDashboard from "./components/Home";
import TeacherDashboard from "./components/TeacherDashboard";
import Radar from "./components/Radar";
import Teacherradar from "./components/Teacherradar";
import Attendance from "./components/Attendance";
import ScanQR from "./components/ScanQr";
import { supabase } from "./supabaseClient";
import RegisterFace from "./components/RegisterFace";
import FaceAttendance from "./components/FaceAttendance";

function App() {
  const [view, setView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  // ✅ ID verification state
  const [idVerified, setIdVerified] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  // ✅ QR Scan Page
  if (view === "scan-qr") {
    return (
      <ScanQR
        setView={setView}
        onVerified={() => setIdVerified(true)}
      />
    );
  }

  if (view === "student-dash") {
    return <StudentDashboard setView={setView} />;
  }

  if (view === "teacher-dash") {
    return <TeacherDashboard setView={setView} />;
  }

  if (view === "radar") {
    if (user?.user_metadata?.role === "teacher") {
      return (
        <Teacherradar
          setView={setView}
          setSelectedClass={setSelectedClass}
        />
      );
    }

    return (
      <Radar
        setView={setView}
        userRole={user?.user_metadata?.role}
        idVerified={idVerified}
      />
    );
  }

  if (view === "teacher-radar") {
    return (
      <Teacherradar
        setView={setView}
        setSelectedClass={setSelectedClass}
      />
    );
  }

  if (view === "attendance") {
    return <Attendance className={selectedClass} setView={setView} />;
  }

  if (view === "student-auth") {
    return (
      <StudentAuth
        goBack={() => setView("dashboard")}
        onLoginSuccess={() => setView("student-dash")}
      />
    );
  }

  if (view === "teacher-auth") {
    return (
      <TeacherAuth
        goBack={() => setView("dashboard")}
        onLoginSuccess={() => setView("teacher-dash")}
      />
    );
  }

if (view === "register-face") return <RegisterFace setView={setView} />;
if (view === "face-attendance") return <FaceAttendance setView={setView} />;


  return <Dashboard setView={setView} />;
}

export default App;
