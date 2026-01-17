import React from "react";
import ScanQR from "./components/ScanQR";

function App() {
  return (
    <div style={styles.app}>
      <ScanQR />
    </div>
  );
}

export default App;

const styles = {
  app: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },
};
