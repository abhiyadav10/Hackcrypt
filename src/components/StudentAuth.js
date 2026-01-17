import React, { useState, useEffect } from "react";
import "./AuthPage.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { supabase } from "../supabaseClient";

function StudentAuth({ goBack, onLoginSuccess }) {
    const [isActive, setIsActive] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    // Auto-login if session exists and matches role
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.user_metadata?.role === 'student') {
                if (onLoginSuccess) onLoginSuccess();
            }
        };
        checkSession();
    }, [onLoginSuccess]);

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
            if (onLoginSuccess) onLoginSuccess();
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
                    role: 'student',
                },
            },
        });
        if (error) {
            alert(error.message);
        } else {
            alert("Registration Successful! Please check your email for verification.");
            if (onLoginSuccess) onLoginSuccess();
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className={`box ${isActive ? "active" : ""}`}>

                {/* LOGIN */}
                <div className="form login">
                    <h2>Student Login</h2>

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
                    <h2>Student Register</h2>

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
                    <h1>Welcome Student!</h1>
                    <p>
                        Login to access your attendance and reports.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default StudentAuth;