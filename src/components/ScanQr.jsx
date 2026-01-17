import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

export default function ScanQR({ setView, onVerified }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [qrd, setQrd] = useState([]);

  useEffect(() => {
    let interval;
    if (scanning) {
      interval = setInterval(scanQRCode, 700);
    }
    return () => clearInterval(interval);
  }, [scanning]);

  const scanQRCode = () => {
    const webcam = webcamRef.current;
    if (!webcam) return;

    const imageSrc = webcam.getScreenshot();
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const code = jsQR(
        imageData.data,
        canvas.width,
        canvas.height
      );

      if (code?.data) {
        setScanning(false);
        setLastScan(code.data);

        setQrd((prev) =>
          prev.includes(code.data) ? prev : [...prev, code.data]
        );

        // ✅ ID verified & go back to radar
        onVerified();
        setTimeout(() => setView("radar"), 1500);
      }
    };
  };

  const startScan = () => {
    setLastScan(null);
    setScanning(true);
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>QR Scanner</h1>

      {!scanning && !lastScan && (
        <button style={styles.startButton} onClick={startScan}>
          Start Scanning
        </button>
      )}

      {scanning && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{ facingMode: "environment" }}
          style={styles.webcam}
        />
      )}

      {lastScan && (
        <div style={styles.resultBox}>
          <h3>Scanned QR:</h3>
          <p>{lastScan}</p>
        </div>
      )}

      <h2>Previous Scans</h2>
      {qrd.map((item, i) => (
        <div key={i} style={styles.listItem}>
          {item}
        </div>
      ))}
    </div>
  );
}

const styles = {
  webcam: {
    width: "100%",
    maxWidth: "380px",
    borderRadius: "10px",
    border: "3px solid #1976d2",
    marginTop: "15px",
  },
  startButton: {
    background: "#1976d2",
    color: "white",
    padding: "12px 22px",
    borderRadius: "10px",
    fontSize: "18px",
    cursor: "pointer",
    border: "none",
  },
  resultBox: {
    background: "#e3f2fd",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "15px",
  },
  listItem: {
    background: "#f8f8f8",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "8px",
  },
};
