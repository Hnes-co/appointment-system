import React from "react";
import AppointmentSystem from "./AppointmentSystem";

function App() {
  const parameters = {
    durationOptions: [15, 30, 45, 60, 90],
    startTime: 8,
    endTime: 16,
    days: 5,
    futureWeeks: 2,
    exceptions: [
      {
        days: [6,7],
        start: 10,
        end: 16
      },
      {
        date: new Date(2022, 9, 31),
        start: 12,
        end: 20
      },
    ]
  };

  const backEndUrl = {
    appointments: "http://localhost:3001/api/appointments",
    parameters: "http://localhost:3001/api/parameters"
  };

  return (
    <div className="wrapper">
        <AppointmentSystem parameters={parameters} backEndUrl={backEndUrl}/>
    </div>
  );
}

export default App;
