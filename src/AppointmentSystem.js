
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import UserInterface from './components/UserInterface';
import adminCredentials from './assets/adminCredentials.json';

function AppointmentSystem({ parameters, url, code }) {

  const d = new Date();
  const [weekStart, setWeekStart] = useState(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() === 7 ? 0 : d.getDay()) + 1));
  const [weekEnd, setWeekEnd] = useState(new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 - (d.getDay() === 7 ? 0 : d.getDay())));
  const [appointmentCalendar, setAppointmentCalendar] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [duration, setDuration] = useState();
  const [calendarMode, setCalendarMode] = useState("normal");
  const [selection, setSelection] = useState("");
  const [dialogMode, setDialogMode] = useState("add");
  const dialogOpen = useRef();
  const appointmentID = useRef(0);
  const details = useRef({ name: "", email: "", notes: "" });
  const codeInput = useRef();
  const [message, setMessage] = useState("");
  const [totalStep, setTotalStep] = useState(0);

  useEffect(() => {
    async function getAppointments() {
      let temp = [];
      let presentTime = new Date().getTime();
      try {
        const response = await (await fetch(url)).json();
        if(response && !response.error) {
          response.forEach(async (e) => {
            e.time = new Date(e.time);
            if(e.time.getTime() > presentTime) {
              temp.push(e);
            }
            else {
              await fetch(url + "/" + e._id, {
                method: 'DELETE',
                headers: {
                  'Content-type': 'application/json'
                }
              });
            }
          });
          setAppointments(temp.sort((a, b) => { return a.time.getTime() - b.time.getTime(); }));
        }
        else {
          window.alert("Failed to fetch appointments from server." + response?.error);
        }
      } catch(error) {
        window.alert("Failed to fetch appointments from server.\n" + error);
      }
    }
    if(url) getAppointments();
  }, [url]);

  useEffect(() => {
    let tempCalendar = [];
    let durationInMs = duration * 60000;
    let presentTime = new Date().getTime();
    if(calendarMode === "admin") {
      for(let i = weekStart.getTime(); i <= weekEnd.getTime(); i += 86400000) {
        let title = new Date(i);
        let times = [];
        for(const e of appointments) {
          if(e.time.getDate() === title.getDate()) {
            times.push({ title: e.time, status: "available" });
          }
        }
        tempCalendar.push({ title: title, times: times });
      }
    }
    else {
      for(let i = weekStart.getTime(); i <= weekEnd.getTime(); i += 86400000) {
        let title = new Date(i);
        let times = [];
        let start = title.getTime() + (parameters.startTime * 3600000);
        let end = title.getTime() + (parameters.endTime * 3600000);
        if(parameters.exceptions) {
          for(const e of parameters.exceptions) {
            if(e.days?.includes(title.getDay() === 0 ? 7 : title.getDay())) {
              start = title.getTime() + e.start * 3600000;
              end = title.getTime() + e.end * 3600000;
              break;
            }
            else if(e.date?.getTime() === title.getTime()) {
              start = e.date.getTime() + e.start * 3600000;
              end = e.date.getTime() + e.end * 3600000;
            }
          }
        }
        for(let j = start; j < end; j += durationInMs) {
          let obj = { title: new Date(j), status: "available" };
          if(obj.title.getTime() <= presentTime + durationInMs || (obj.title.getDay() === 0 ? 7 : obj.title.getDay()) > parameters.days) {
            obj.status = "unavailable";
          }
          else if(appointments.some(e => (
            Math.max(e.time.getTime(), obj.title.getTime()) - Math.min(e.time.getTime() + e.duration * 60000, obj.title.getTime() + duration * 60000) < 0
          ))) {
            obj.status = "unavailable";
          }
          times.push(obj);
        }
        tempCalendar.push({ title: title, times: times });
      }
    }
    setAppointmentCalendar(tempCalendar);
  }, [parameters, duration, appointments, weekStart, weekEnd, calendarMode]);

  async function createAppointment(data) {
    if(url) {
      try {
        const response = await (await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })).json();
        if(response && !response.error) {
          response.time = new Date(response.time);
          setAppointments(appointments.concat([response]));
          window.alert("Appointment confirmed.");
        }
        else {
          window.alert("Failed to save appointment.\n\n" + response.error);
        }
      }
      catch(error) {
        window.alert("Failed to save appointment.\n\n" + error);
      }
    }
    else {
      setAppointments(appointments.concat([data]));
    }
  }

  async function deleteAppointment(id) {
    if(url) {
      try {
        const response = await fetch(url + "/" + id, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          }
        });
        if(response && response.ok) {
          setAppointments(prevState => prevState.filter(e => e._id !== selection._id));
          window.alert("Appointment deleted.");
        }
        else {
          window.alert("Failed to delete appointment.\n\n");
        }
      }
      catch(error) {
        window.alert("Failed to delete appointment.\n\n" + error);
      }
    }
    else {
      setAppointments(prevState => prevState.filter(e => e._id !== selection._id));
    }
  }

  function openDialog(date) {
    let match = appointments.find(e => e.time.getTime() === date.getTime());
    if(match) {
      setDialogMode("examine");
      setSelection(match);
    }
    else {
      setDialogMode("add");
      setSelection(date);
      appointmentID.current = new Date().getTime();
    }
    dialogOpen.current.showModal();
  }

  function closeDialog() {
    details.current = { name: "", email: "", notes: "" };
    setSelection("");
    dialogOpen.current.close();
  }

  function updateAppointments(event) {
    event.preventDefault();
    if(dialogMode === "add") {
      createAppointment({
        _id: appointmentID.current,
        time: selection,
        duration: duration,
        details: details.current
      });
    }
    else if(dialogMode === "examine") {
      if(window.confirm("Are you sure you want to delete this appointment?")) {
        deleteAppointment(selection._id);
      }
    }
    closeDialog();
  }

  function updateWeek(step) {
    if(totalStep + step >= 0 && totalStep + step <= parameters.futureWeeks) {
      setWeekStart(prevState => new Date(prevState.setDate(prevState.getDate() + step * 7)));
      setWeekEnd(prevState => new Date(prevState.setDate(prevState.getDate() + step * 7)));
      setTotalStep(prevState => prevState + step);
    }
  }

  function handleAppointmentSearch(event) {
    event.preventDefault();
    const value = codeInput.current.value;
    if(value === "") return;
    setMessage("");
    let match = appointments.find(e => e._id === value);
    if(match) {
      openDialog(match.time);
    }
    else if((Number(value) === adminCredentials.code && !code) || (code && value === code)) {
      if(calendarMode !== "admin") {
        setCalendarMode("admin");
      }
      else {
        setMessage("Already in admin mode.");
      }
    }
    else {
      setMessage("Appointment not found.");
    }
    codeInput.current.value = "";
  }

  return (
    <UserInterface
      appointmentCalendar={appointmentCalendar}
      weekStart={weekStart}
      weekEnd={weekEnd}
      calendarMode={calendarMode}
      setCalendarMode={setCalendarMode}
      updateWeek={updateWeek}
      parameters={parameters}
      duration={duration}
      setDuration={setDuration}
      selection={selection}
      dialogOpen={dialogOpen}
      openDialog={openDialog}
      closeDialog={closeDialog}
      dialogMode={dialogMode}
      details={details}
      appointmentID={appointmentID}
      updateAppointments={updateAppointments}
      codeInput={codeInput}
      handleAppointmentSearch={handleAppointmentSearch}
      message={message}
    />
  );
}

export default AppointmentSystem;
