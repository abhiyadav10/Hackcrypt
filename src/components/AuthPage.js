import React, { useState } from "react";
import "./AuthPage.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { supabase } from "../supabaseClient"; // Import supabase client

function AuthPage({ role, goBack }) {
  const [isActive, setIsActive] = useState(false);
  // handling form inputs (supabase)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Keeping username for display or future use
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Login User Successfully!");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          role: role,
        },
      },
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Registration Successful! Please check your email for verification.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className={`box ${isActive ? "active" : ""}`}>
        {/* LOGIN */}
        <div className="form login">
          <h2>{role === "student" ? "Student Login" : "Teacher Login"}</h2>
          {/* Login form submission */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p>
            Don't have an account?{" "}
            <span onClick={() => setIsActive(true)}>Register</span>
          </p>

          <p onClick={goBack} style={{ cursor: "pointer", color: "#2563eb" }}>
            ⬅ Back to Home
          </p>
        </div>

        {/* REGISTER */}
        <div className="form register">
          <h2>{role === "student" ? "Student Register" : "Teacher Register"}</h2>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p>
            Already have an account?{" "}
            <span onClick={() => setIsActive(false)}>Login</span>
          </p>
        </div>

        {/* OVERLAY */}
        <div className="overlay">
          <h1>Welcome {role === "student" ? "Student" : "Teacher"}!</h1>
          <p>
            Login to access your account and continue your journey.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AuthPage;
