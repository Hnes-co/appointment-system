
import './App.css';
import {useState, useEffect} from 'react';
import UserInterface from './components/UserInterface';
import adminCredentials from './assets/adminCredentials.json'

function AppointmentSystem({parameters, backEndUrl}) {

  const d = new Date();
  const [appointmentCalendar, setAppointmentCalendar] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [weekStart, setWeekStart] = useState(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() === 0 ? 7 : d.getDay()) + 1));
  const [weekEnd, setWeekEnd] = useState(new Date(d.getFullYear(), d.getMonth(), d.getDate() + (7 - (d.getDay() === 0 ? 7 : d.getDay()))));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const [appointmentID, setAppointmentID] = useState(0);
  const [details, setDetails] = useState({name: "", email: "", notes: ""});
  const [duration, setDuration] = useState();
  const [codeInput, setCodeInput] = useState("");
  const [calendarMode, setCalendarMode] = useState("normal"); 
  const [message, setMessage] = useState("");
  const [dialogMode, setDialogMode] = useState("add");
  const [totalStep, setTotalStep] = useState(0);

  useEffect(() => {
    async function getAppointments() {
      let temp = [];
      let presentTime = new Date().getTime();
      await fetch(backEndUrl.appointments)
      .then(response => response.json())
      .then(resJson => {
        if(!resJson.error) {
          resJson.forEach(async (e) => { 
            e.time = new Date(e.time);
            if(e.time.getTime() > presentTime) {
              temp.push(e);
            }
            else {
              await fetch(backEndUrl.appointments+"/"+e._id, {
                method: 'DELETE',
                headers: {
                  'Content-type': 'application/json'
                }
              });
            }
          });
          setAppointments(temp.sort((a,b) => {return a.time.getTime() - b.time.getTime()}));
        }
        else {
          window.alert("Failed to fetch appointments from server." +  resJson.error );
        }
      });
    }
    getAppointments();
  },[backEndUrl]);

  useEffect(() => {
    let tempWeeks = [];
    let durationInMs = duration * 60000;
    let presentTime = new Date().getTime();
    if(calendarMode === "admin") {
      for(let i = weekStart.getTime(); i <= weekEnd.getTime(); i += 86400000) {
        let title = new Date(i);
        let times = [];
        for(const e of appointments) {
          if(e.time.getDate() === title.getDate()) {
            times.push({title: e.time, status: "available"});
          }
        }
        tempWeeks.push({title: title, times: times});
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
          let obj = {title: new Date(j), status: "available"};
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
        tempWeeks.push({title: title, times: times});
      }
    }
    setAppointmentCalendar(tempWeeks);
  },[parameters, duration, appointments, weekStart, weekEnd, calendarMode]);

  async function createAppointment(data) {
    await fetch(backEndUrl.appointments, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resJson => {
      if(!resJson.error) {
        resJson.time = new Date(resJson.time)
        setAppointments(appointments.concat([resJson]));
        window.alert("Appointment confirmed.\n\n Confirmation email sent.");
      }
      else {
        window.alert("Failed to save appointment.\n\n" + resJson.error);
      }
    });
  }

  async function deleteAppointment(id) {
    await fetch(backEndUrl.appointments+"/"+id, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
    .then(response => {
      return response.ok;
    });
  }

  function openDialog(date) {
    let match = appointments.find(e => e.time.getTime() === date.getTime());
    if(match) {
      setDialogMode("modify");
      setSelection(match);
    }
    else {
      setDialogMode("add");
      setSelection(date);
      setAppointmentID(new Date().getTime());
    }
    setDialogOpen(true);
  }

  function closeDialog() {
    setDetails({name: "", email: "", notes: ""});
    setSelection("");
    setDialogOpen(false);
  }

  function updateAppointments(event) {
    event.preventDefault();
    if(dialogMode === "add") {
      createAppointment({
        _id: appointmentID,
        time: selection,
        duration: duration,
        details: details
      });
    }
    else if(dialogMode === "modify") {
      if(deleteAppointment(selection._id)) {
        setAppointments(appointments.filter(e => e._id !== selection._id));
        window.alert("Appointment deleted.");
      }
      else {
        window.alert("Something went wrong.\n\nFailed to delete appointment.");
      }
    }
    closeDialog();
  }

  function updateWeek(step) {
    if(totalStep + step >= 0 && totalStep + step <= parameters.futureWeeks * 7) {
      setWeekStart(new Date(weekStart.setDate(weekStart.getDate() + step)));
      setWeekEnd(new Date(weekEnd.setDate(weekEnd.getDate() + step)));
      setTotalStep(totalStep + step);
    }
  }

  function handleAppointmentSearch() {
    setMessage("");
    let match = appointments.find(e => e._id === codeInput);
    if(match) {
      openDialog(match.time);
    }
    else if(Number(codeInput) === adminCredentials.code) {
      if(calendarMode !== "admin") {
        setCalendarMode("admin");
      }
      else {
        setMessage("Already in admin mode.");
      }
    }
    else{
      setMessage("Appointment not found.");
    }
    setCodeInput("");
  }

  return (
    <UserInterface 
      calendarMode={calendarMode}
      setCalendarMode={setCalendarMode}
      dialogOpen={dialogOpen}
      selection={selection}
      appointmentID={appointmentID}
      updateAppointments={updateAppointments}
      details={details}
      setDetails={setDetails}
      closeDialog={closeDialog}
      dialogMode={dialogMode}
      codeInput={codeInput}
      setCodeInput={setCodeInput}
      handleAppointmentSearch={handleAppointmentSearch}
      message={message}
      appointmentCalendar={appointmentCalendar}
      weekStart={weekStart}
      weekEnd={weekEnd}
      updateWeek={updateWeek}
      openDialog={openDialog}
      parameters={parameters}
      duration={duration}
      setDuration={setDuration}
    />
  );
}

export default AppointmentSystem;