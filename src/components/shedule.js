import React from "react";
import "./App.css";

const Schedule = () => {
  const scheduleData = [
    {
      day: "Monday",
      subjects: [
        { time: "09:00 - 10:00", name: "Mathematics", status: "Present" },
        { time: "10:15 - 11:15", name: "Physics", status: "Absent" },
        { time: "11:30 - 12:30", name: "Computer Science", status: "Present" },
      ],
    },
    {
      day: "Tuesday",
      subjects: [
        { time: "09:00 - 10:00", name: "Chemistry", status: "Present" },
        { time: "10:15 - 11:15", name: "English", status: "Present" },
        { time: "11:30 - 12:30", name: "Mathematics", status: "Absent" },
      ],
    },
    {
      day: "Wednesday",
      subjects: [
        { time: "09:00 - 10:00", name: "Physics", status: "Present" },
        { time: "10:15 - 11:15", name: "Computer Lab", status: "Present" },
      ],
    },
  ];

  return (
    <div className="schedule-container">
      <h1 className="title">Student Schedule & Attendance</h1>

      {scheduleData.map((dayItem, index) => (
        <div className="day-card" key={index}>
          <h2 className="day-title">{dayItem.day}</h2>

          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Subject</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {dayItem.subjects.map((subject, i) => (
                <tr key={i}>
                  <td>{subject.time}</td>
                  <td>{subject.name}</td>
                  <td
                    className={
                      subject.status === "Present"
                        ? "status-present"
                        : "status-absent"
                    }
                  >
                    {subject.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Schedule;