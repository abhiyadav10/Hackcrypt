import React, { useState } from 'react';
import './App.css';
import RegisterFace from './RegisterFace';
import FaceAttendance from './pages/FaceAttendance';

function App() {
  const [currentPage, setCurrentPage] = useState('attendance');

  return (
    <div className="App">
      <header style={{ padding: "20px" }}>

        <h1>Face Recognition System</h1>
        <nav style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setCurrentPage('attendance')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: currentPage === 'attendance' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Mark Attendance
          </button>
          <button 
            onClick={() => setCurrentPage('register')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentPage === 'register' ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Register Face
          </button>
        </nav>
      </header>
      <main>
        {currentPage === 'attendance' ? <FaceAttendance /> : <RegisterFace />}
      </main>
    </div>
  );
}

export default App;
