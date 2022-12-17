import React, { useEffect, useRef, useState } from "react";
import AppointmentCalendar from "./AppointmentCalendar";
import Dialog from "./Dialog";
import searchIcon from '../assets/search.svg';
import returnIcon from '../assets/return.svg';

function UserInterface(props) {

  const [resizeElement, setResizeElement] = useState(false);
  const parentElement = useRef();

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  function handleResize() {
    if(parentElement.current.offsetWidth < 650 && !resizeElement) {
      setResizeElement(true);
    }
    if(parentElement.current.offsetWidth >= 650 && resizeElement) {
      setResizeElement(false);
    }
  }

  function handleResizeClass(defaultClass) {
    if(parentElement.current?.offsetWidth < 650) {
      if(defaultClass.includes("dialog") && window.innerWidth > 650) {
        return defaultClass;
      }
      options.month = "numeric";
      const splitClass = defaultClass.split(" ");
      if(splitClass.length > 1) {
        return defaultClass + " " + splitClass[1] + "-mobile";
      }
      return defaultClass + " " + defaultClass + "-mobile";
    }
    return defaultClass;
  }

  return (
    <div className="main-container" ref={parentElement}>
      <Dialog
        calendarMode={props.calendarMode}
        dialogOpen={props.dialogOpen}
        selection={props.selection}
        appointmentID={props.appointmentID}
        updateAppointments={props.updateAppointments}
        details={props.details}
        duration={props.duration}
        closeDialog={props.closeDialog}
        openDialog={props.openDialog}
        dialogMode={props.dialogMode}
        parameters={props.parameters}
        options={options}
        handleResizeClass={handleResizeClass}
      />
      {props.calendarMode === "normal" ?
        <div className="top-menu">
          <form className={handleResizeClass("search-bar")} onSubmit={props.handleAppointmentSearch}>
            <label>Appointment code:</label>
            <div>
              <input className="top-menu-input" ref={props.codeInput}></input>
              <button className="calendar-button top-menu-button" type="submit"><img src={searchIcon} alt="searchIcon" /></button>
            </div>
            <label className="info-message">{props.message}</label>
          </form>
        </div>
        :
        <div className="top-menu top-menu-admin">
          <div className="admin-mode-header">
            <label className="admin-header-title">Switched to admin view</label>
            <div title="Return to normal view" className="top-menu-admin-button">
              <img className="calendar-button" src={returnIcon} alt="returnIcon" onClick={() => props.setCalendarMode("normal")} />
            </div>
          </div>
          <div className={handleResizeClass("search-bar")}>
            <label>Appointment code:</label>
            <div>
              <input className="top-menu-input" ref={props.codeInput}></input>
              <div className="calendar-button top-menu-button" onClick={props.handleAppointmentSearch}><img src={searchIcon} alt="searchIcon" /></div>
            </div>
            <label className="info-message">{props.message}</label>
          </div>
        </div>
      }
      <AppointmentCalendar
        duration={props.duration}
        setDuration={props.setDuration}
        updateWeek={props.updateWeek}
        weekStart={props.weekStart}
        weekEnd={props.weekEnd}
        appointmentCalendar={props.appointmentCalendar}
        openDialog={props.openDialog}
        durationOptions={props.parameters.durationOptions}
        calendarMode={props.calendarMode}
        handleResizeClass={handleResizeClass}
      />
    </div>
  );
}

export default UserInterface;
