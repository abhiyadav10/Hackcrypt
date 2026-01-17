import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { supabase } from "../supabaseClient";

const FaceAttendance = ({ setView }) => {
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");
  const [registeredFaceData, setRegisteredFaceData] = useState(null);
  const [showAttendancePage, setShowAttendancePage] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL =
          "https://justadudewhohacks.github.io/face-api.js/models";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setLoaded(true);
        setMsg("✅ Face detection ready. Click 'Mark Attendance' to proceed.");
      } catch (error) {
        setMsg(`Error loading models: ${error.message}`);
      }
    };

    loadModels();
  }, []);

  const euclideanDistance = (a, b) => {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
  };

  const captureFaceForRegistration = async () => {
    try {
      setLoading(true);
      setMsg("Detecting face...");

      if (!webcamRef.current?.video) {
        setMsg("❌ Camera not ready");
        setLoading(false);
        return;
      }

      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
        setMsg("⏳ Camera loading...");
        setLoading(false);
        return;
      }

      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        setMsg("❌ Failed to capture image");
        setLoading(false);
        return;
      }

      const img = await faceapi.fetchImage(screenshot);

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMsg("❌ No face detected. Please position your face in the camera.");
        setLoading(false);
        return;
      }

      const faceDescriptor = Array.from(detection.descriptor);
      setRegisteredFaceData(faceDescriptor);
      setShowNameInput(true);
      setMsg("✅ Face captured! Please enter your name to register.");
      setLoading(false);
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
      setLoading(false);
    }
  };

  const confirmRegisterFace = async () => {
    if (!name.trim()) {
      setMsg("❌ Please enter your name");
      return;
    }

    if (!registeredFaceData) {
      setMsg("❌ No face data captured");
      return;
    }

    try {
      setLoading(true);
      setMsg("Registering face in database...");

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMsg("❌ User not authenticated");
        setLoading(false);
        return;
      }

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: name,
          face_data: JSON.stringify(registeredFaceData),
        });

      if (upsertError) throw upsertError;

      setMsg(`✅ Face registered successfully for ${name}!`);
      setLoading(false);
      setRegisteredName(name);
      setShowNameInput(false);
      setShowAttendancePage(true);
      setName("");
      setRegisteredFaceData(null);

    } catch (error) {
      setMsg(`❌ Error registering face: ${error.message}`);
      setLoading(false);
    }
  };

  const cancelRegister = () => {
    setShowNameInput(false);
    setName("");
    setRegisteredFaceData(null);
    setMsg("Registration cancelled.");
  };

  const markAttendanceForRegistered = async () => {
    try {
      setLoading(true);
      setMsg("Marking attendance...");

      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        setMsg("❌ User not authenticated");
        setLoading(false);
        return;
      }

      // Mark attendance
      const { error: attendanceError } = await supabase
        .from("attendance")
        .insert({
          user_id: currentUser.id,
          marked_at: new Date().toISOString(),
        });

      if (attendanceError) throw attendanceError;

      setMsg(`✅ Attendance marked successfully for ${registeredName}!`);
      setLoading(false);

      // Close after 2 seconds
      setTimeout(() => {
        setShowAttendancePage(false);
        setRegisteredName("");
        setView("radar");
      }, 2000);

    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
      setLoading(false);
    }
  };

  const skipAttendance = () => {
    setShowAttendancePage(false);
    setRegisteredName("");
    setMsg("Returning to main page...");
    setTimeout(() => {
      setView("radar");
    }, 1000);
  };

  const markAttendance = async () => {
    try {
      setLoading(true);
      setMsg("Detecting face...");

      if (!webcamRef.current?.video) {
        setMsg("❌ Camera not ready");
        setLoading(false);
        return;
      }

      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
        setMsg("⏳ Camera loading...");
        setLoading(false);
        return;
      }

      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        setMsg("❌ Failed to capture image");
        setLoading(false);
        return;
      }

      const img = await faceapi.fetchImage(screenshot);

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMsg("❌ No face detected. Please position your face in the camera.");
        setLoading(false);
        return;
      }

      setMsg("Verifying face against database...");

      const liveDescriptor = Array.from(detection.descriptor);

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        setMsg("❌ User not authenticated");
        setLoading(false);
        return;
      }

      // Get user's stored face descriptor from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("face_data")
        .eq("id", currentUser.id)
        .single();

      if (profileError || !profile) {
        setMsg("❌ Face not registered. Please register your face first.");
        setLoading(false);
        return;
      }

      if (!profile.face_data) {
        setMsg("❌ No face data found. Please register your face first.");
        setLoading(false);
        return;
      }

      // Parse stored descriptor
      let storedDescriptor;
      try {
        storedDescriptor = typeof profile.face_data === 'string' 
          ? JSON.parse(profile.face_data) 
          : profile.face_data;
      } catch (e) {
        setMsg("❌ Error reading stored face data");
        setLoading(false);
        return;
      }

      // Compare faces with relaxed threshold
      const distance = euclideanDistance(storedDescriptor, liveDescriptor);
      const THRESHOLD = 0.6; // Relaxed threshold for better matching

      if (distance > THRESHOLD) {
        setMsg(`❌ Face not matched. Distance: ${distance.toFixed(2)} (threshold: ${THRESHOLD})`);
        setLoading(false);
        return;
      }

      // Mark attendance
      const { error: attendanceError } = await supabase
        .from("attendance")
        .insert({
          user_id: currentUser.id,
          marked_at: new Date().toISOString(),
        });

      if (attendanceError) throw attendanceError;

      setMsg("✅ Face verified! Attendance marked successfully!");
      setLoading(false);

      // Close after 2 seconds
      setTimeout(() => {
        if (setView) setView("radar");
      }, 2000);

    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
      setLoading(false);
    }
  };

  const styles = {
    container: {
      textAlign: "center",
      padding: "20px",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "30px",
      maxWidth: "600px",
      width: "100%",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    webcamContainer: {
      border: "3px solid #007bff",
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#f0f8ff",
      display: "inline-block",
      margin: "20px auto",
    },
    webcam: {
      borderRadius: "4px",
      display: "block",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      flexWrap: "wrap",
      margin: "20px 0",
    },
    button: {
      padding: "12px 30px",
      fontSize: "16px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "all 0.3s ease",
    },
    primaryButton: {
      backgroundColor: "#28a745",
      color: "white",
    },
    blueButton: {
      backgroundColor: "#0056b3",
      color: "white",
    },
    dangerButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
    warningButton: {
      backgroundColor: "#ffc107",
      color: "#333",
      fontWeight: "bold",
    },
    disabledButton: {
      backgroundColor: "#ccc",
      color: "#999",
      cursor: "not-allowed",
    },
    message: {
      marginTop: "20px",
      fontSize: "16px",
      minHeight: "30px",
      fontWeight: "500",
      color: "#666",
      padding: "10px",
      borderRadius: "4px",
    },
    loadingMessage: {
      color: "#007bff",
      backgroundColor: "#e7f3ff",
      border: "1px solid #b3d9ff",
    },
    successMessage: {
      color: "#155724",
      backgroundColor: "#d4edda",
      border: "1px solid #c3e6cb",
    },
    errorMessage: {
      color: "#721c24",
      backgroundColor: "#f8d7da",
      border: "1px solid #f5c6cb",
    },
  };

  const getMessageStyle = () => {
    if (msg.includes("✅")) return { ...styles.message, ...styles.successMessage };
    if (msg.includes("❌")) return { ...styles.message, ...styles.errorMessage };
    if (msg.includes("⏳") || msg.includes("Detecting")) return { ...styles.message, ...styles.loadingMessage };
    return styles.message;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {showAttendancePage ? (
          <>
            <h1 style={styles.title}>✅ Face Registered Successfully!</h1>
            <p style={{ fontSize: "18px", color: "#28a745", marginBottom: "20px", fontWeight: "bold" }}>
              Welcome, {registeredName}!
            </p>
            <p style={{ fontSize: "16px", color: "#555", marginBottom: "20px" }}>
              Your face has been registered. You can now mark your attendance.
            </p>

            <p style={{ color: "#007bff", fontSize: "14px", marginBottom: "10px" }}>
              📹 Position your face in the frame to mark attendance
            </p>

            <div style={styles.webcamContainer}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width={400}
                height={300}
                mirrored
                style={styles.webcam}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button
                onClick={markAttendanceForRegistered}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.disabledButton : styles.blueButton),
                }}
              >
                {loading ? "⏳ Marking..." : "✅ Mark Attendance Now"}
              </button>

              <button
                onClick={skipAttendance}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.disabledButton : styles.dangerButton),
                }}
              >
                ⬅ Skip for Now
              </button>
            </div>

            <p style={getMessageStyle()}>{msg}</p>
          </>
        ) : (
          <>
            <h1 style={styles.title}>📸 Face Attendance Verification</h1>

            {!loaded ? (
              <p style={{ fontSize: "18px", color: "#007bff" }}>⏳ Loading face detection models...</p>
            ) : (
              <>
                {showNameInput ? (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }}>
                      Enter your name to register:
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      style={{
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "4px",
                        border: "2px solid #007bff",
                        width: "100%",
                        maxWidth: "400px",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={styles.buttonGroup}>
                      <button
                        onClick={confirmRegisterFace}
                        disabled={loading || !name.trim()}
                        style={{
                          ...styles.button,
                          ...(loading || !name.trim() ? styles.disabledButton : styles.primaryButton),
                        }}
                      >
                        {loading ? "⏳ Registering..." : "✅ Confirm Register"}
                      </button>

                      <button
                        onClick={cancelRegister}
                        disabled={loading}
                        style={{
                          ...styles.button,
                          ...(loading ? styles.disabledButton : styles.dangerButton),
                        }}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ color: "#007bff", fontSize: "14px", marginBottom: "10px" }}>
                      📹 Position your face in the frame
                    </p>

                    <div style={styles.webcamContainer}>
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        width={400}
                        height={300}
                        mirrored
                        style={styles.webcam}
                      />
                    </div>

                    <div style={styles.buttonGroup}>
                      <button
                        onClick={markAttendance}
                        disabled={loading}
                        style={{
                          ...styles.button,
                          ...(loading ? styles.disabledButton : styles.primaryButton),
                        }}
                      >
                        {loading ? "⏳ Processing..." : "✅ Mark Attendance"}
                      </button>

                      <button
                        onClick={captureFaceForRegistration}
                        disabled={loading}
                        style={{
                          ...styles.button,
                          ...(loading ? styles.disabledButton : styles.warningButton),
                        }}
                      >
                        {loading ? "⏳ Processing..." : "🔐 Register Face"}
                      </button>

                      <button
                        onClick={() => setView("radar")}
                        disabled={loading}
                        style={{
                          ...styles.button,
                          ...(loading ? styles.disabledButton : styles.dangerButton),
                        }}
                      >
                        ⬅ Back
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <p style={getMessageStyle()}>{msg}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FaceAttendance;
