import React from "react";

function Appointment(props) {
  return (
    <>
      {props.times.map(e => (
        <div key={e.title.getTime()} className={`time-item time-item-${e.status}`}>
          <label onClick={e.status === "available" ? () => props.openDialog(e.title) : null}>
            {e.title.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </label>
        </div>
      ))}
    </>
  );
}

export default Appointment;