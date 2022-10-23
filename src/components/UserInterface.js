import React from "react";
import AppointmentCalendar from "./AppointmentCalendar";
import Dialog from "./Dialog";
import searchIcon from '../assets/search.svg';
import returnIcon from '../assets/return.svg';

function UserInterface(props) {

  return (
    <div className={props.dialogOpen? "main-container main-container-disabled" : "main-container"}>
      <Dialog 
        calendarMode={props.calendarMode}
        dialogOpen={props.dialogOpen}
        selection={props.selection}
        appointmentID={props.appointmentID}
        updateAppointments={props.updateAppointments}
        details={props.details}
        setDetails={props.setDetails}
        duration={props.duration}
        closeDialog={props.closeDialog}
        openDialog={props.openDialog}
        dialogMode={props.dialogMode}
        parameters={props.parameters}
      />
      {props.calendarMode === "normal" ? 
      <div className="top-menu">
        <div className="search-bar">
          <label>Appointment code:</label>
          <input className="top-menu-input" value={props.codeInput} onChange={({target}) => props.setCodeInput(target.value)}></input>
          <div className="calendar-button top-menu-button" onClick={props.handleAppointmentSearch}><img src={searchIcon} alt="searchIcon"/></div>
          <label className="info-message">{props.message}</label>
        </div>    
      </div>
      :
      <div className="top-menu top-menu-admin">
        <div className="admin-mode-header">
          <label className="admin-header-title">Switched to admin view</label>
          <div title="Return to normal view" className="top-menu-admin-button">
            <img className="calendar-button" src={returnIcon} alt="returnIcon" onClick={() => props.setCalendarMode("normal")}/>
          </div>
        </div>
        <div className="search-bar">
          <label>Appointment code:</label>
          <input className="top-menu-input" value={props.codeInput} onChange={({target}) => props.setCodeInput(target.value)}></input>
          <div className="calendar-button top-menu-button" onClick={props.handleAppointmentSearch}>
            <img src={searchIcon} alt="searchIcon"/>
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
      />
    </div>
  )
}

export default UserInterface;
