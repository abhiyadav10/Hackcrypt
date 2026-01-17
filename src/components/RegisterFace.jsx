import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { supabase } from "../supabaseClient";

const RegisterFace = ({ setView }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

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

        setModelsLoaded(true);
        setMsg("✅ Models loaded. Click 'Open Camera' to register.");
      } catch (error) {
        setMsg(`Error loading models: ${error.message}`);
      }
    };

    loadModels();
  }, []);

  const registerFace = async () => {
    try {
      setLoading(true);
      setMsg("Detecting face...");

      if (!webcamRef.current?.video) {
        setMsg("❌ Camera not ready. Wait 1 sec.");
        setLoading(false);
        return;
      }

      const video = webcamRef.current.video;
      if (video.readyState !== 4) {
        setMsg("⏳ Camera stream loading...");
        setLoading(false);
        return;
      }

      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        setMsg("❌ Screenshot failed");
        setLoading(false);
        return;
      }

      const img = await faceapi.fetchImage(screenshot);

      setMsg("Analyzing face...");

      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMsg("❌ No face detected. Please position your face in the camera.");
        setLoading(false);
        return;
      }

      setMsg("Saving face to database...");

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMsg("❌ User not authenticated");
        setLoading(false);
        return;
      }

      const faceDescriptor = JSON.stringify(Array.from(detection.descriptor));

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          face_data: faceDescriptor,
        });

      if (upsertError) throw upsertError;

      setMsg("✅ Face registered successfully!");
      setLoading(false);
      setCameraOn(false);

      // Redirect after 2 seconds
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
      width: "400px",
      height: "300px",
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
      backgroundColor: "#0056b3",
      color: "white",
    },
    successButton: {
      backgroundColor: "#28a745",
      color: "white",
    },
    dangerButton: {
      backgroundColor: "#dc3545",
      color: "white",
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
    if (msg.includes("⏳") || msg.includes("Detecting") || msg.includes("Analyzing") || msg.includes("Saving")) 
      return { ...styles.message, ...styles.loadingMessage };
    return styles.message;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📸 Register Your Face</h1>

        {!modelsLoaded ? (
          <p style={{ fontSize: "18px", color: "#007bff" }}>⏳ Loading face detection models...</p>
        ) : (
          <>
            {!cameraOn ? (
              <>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
                  Click below to open camera and register your face
                </p>
                <button
                  onClick={() => setCameraOn(true)}
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                  }}
                >
                  📷 Open Camera
                </button>
              </>
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
                    videoConstraints={{
                      width: 640,
                      height: 480,
                      facingMode: "user",
                    }}
                    style={styles.webcam}
                  />
                </div>

                <div style={styles.buttonGroup}>
                  <button
                    onClick={registerFace}
                    disabled={loading}
                    style={{
                      ...styles.button,
                      ...(loading ? styles.disabledButton : styles.successButton),
                    }}
                  >
                    {loading ? "⏳ Processing..." : "📸 Capture & Register"}
                  </button>

                  <button
                    onClick={() => setCameraOn(false)}
                    disabled={loading}
                    style={{
                      ...styles.button,
                      ...(loading ? styles.disabledButton : styles.dangerButton),
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </>
            )}
          </>
        )}

        <p style={getMessageStyle()}>{msg}</p>

        {cameraOn && (
          <button
            onClick={() => setView("radar")}
            disabled={loading}
            style={{
              ...styles.button,
              marginTop: "20px",
              ...(loading ? styles.disabledButton : styles.dangerButton),
            }}
          >
            ⬅ Back to Radar
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterFace;
