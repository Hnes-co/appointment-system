import React from "react";
import Appointment from "./Appointment";
import arrowLeftIcon from '../assets/arrow_left.svg';
import arrowRightIcon from '../assets/arrow_right.svg';

function AppointmentCalendar(props) {

  const dayFormat = new Intl.DateTimeFormat(navigator.languages[0], { weekday: 'long' });

  if(props.duration || props.calendarMode === "admin") {
    return (
      <div className="calendar">
        <div className="calendar-title">
          <div className={props.handleResizeClass("calendar-button week-button-left")} onClick={() => props.updateWeek(-1)}>
            <img src={arrowLeftIcon} alt="arrow" />
            <span>Previous week</span>
          </div>
          <div className={props.handleResizeClass("week-header")}>{props.weekStart.toLocaleDateString() + " - " + props.weekEnd.toLocaleDateString()}</div>
          <div className={props.handleResizeClass("calendar-button week-button-right")} onClick={() => props.updateWeek(1)}>
            <span>Next week</span>
            <img src={arrowRightIcon} alt="arrow" />
          </div>
        </div>
        <div className="calendar-grid">
          {props.appointmentCalendar.map(day => (
            <div key={day.title.getTime()} className="grid-item">
              <div className="grid-header">{dayFormat.format(day.title)}</div>
              <Appointment
                times={day.times}
                openDialog={props.openDialog}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="duration-menu">
        <label className="duration-menu-title">Choose appointment duration</label>
        <div className="duration-options">
          {props.durationOptions.map(e => (
            <label key={e} onClick={() => props.setDuration(Number(e))} className="calendar-button text-button">{e} min</label>
          ))}
        </div>
      </div>
    );
  }
}

export default AppointmentCalendar;