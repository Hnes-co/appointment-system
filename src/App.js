
import './App.css';
import {useState, useEffect} from 'react';

function App() {

  const [parameters] = useState({
    timeframe: '1h',
    startTime: 8,
    endTime: 16,
    days: 5
  })
  const [d, setD] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [weekStart, setWeekStart] = useState(new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() === 0 ? 7 : d.getDay()) + 1));
  const [weekEnd, setWeekEnd] = useState(new Date(d.getFullYear(), d.getMonth(), d.getDate() + (7 - (d.getDay() === 0 ? 7 : d.getDay()))));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selection, setSelection] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [calendarMode, setCalendarMode] = useState("normal"); 
  const [message, setMessage] = useState("");
  const [dialogMode, setDialogMode] = useState("add");

  const lan = navigator.languages[0];
  const dayFormat = new Intl.DateTimeFormat(lan, {weekday: 'long'});
  const adminCode = 12345;

  useEffect(() => {
    let tempWeeks = [];
    if(calendarMode === "admin") {
      for(let i = weekStart.getTime(); i <= weekEnd.getTime(); i += 86400000) {
        let title = new Date(i);
        let times = [];
        for(let j = parameters.startTime; j < parameters.endTime; j++) {
          let time = new Date(title);
          time.setHours(j);
          let status = "unavailable";
          if(appointments.some(el => el.time.getTime() === time.getTime())) {
            status = "available";
          }
          times.push(
            {
              title: time,
              status: status
            }
          );
        }
        tempWeeks.push(
          {
            title: title,
            times: times
          }
        );
      }
    }
    else {
      for(let i = weekStart.getTime(); i <= weekEnd.getTime(); i += 86400000) {
        let title = new Date(i);
        let times = [];
        for(let j = parameters.startTime; j < parameters.endTime; j++) {
          let time = new Date(title);
          time.setHours(j);
          let status = "available";
          if(time.getTime() <= d.getTime() - 3600000 || 
            (time.getDay() === 0 ? 7 : time.getDay()) > parameters.days || 
            appointments.some(el => el.time.getTime() === time.getTime())) {
            status = "unavailable";
          }
          times.push(
            {
              title: time,
              status: status
            }
          );
        }
        tempWeeks.push(
          {
            title: title,
            times: times
          }
        );
      }
    }
    setWeekDays(tempWeeks);
  },[d, appointments, parameters, weekEnd, weekStart, calendarMode]);



  function openDialog(date) {
    if(calendarMode === "normal") {
      for(let i = 0; i < weekDays.length; i++) {
        let match = weekDays[i].times.find(e => e.title.getTime() === date.getTime())
        if(match) {
          if(match.status !== "unavailable") {
            setDialogOpen(true);
            setSelection(date);
          }
          break;
        }
      }
    }
    else if(calendarMode === "admin") {
      let match = appointments.find(e => e.time.getTime() === date.getTime());
      if(match) {
        setDialogOpen(true);
        setSelection(match);
      }
    }
  }

  function closeDialog() {
    setName("");
    setEmail("");
    setDialogOpen(false);
    setSelection("");
    setDialogMode("add");
  }

  function updateAppointments(event) {
    event.preventDefault();

    if(calendarMode === "normal") {
      if(dialogMode === "add") {
        setAppointments(appointments.concat([{
          id: d.getTime(),
          time: selection,
          details: {
            name: name,
            email: email
          }
        }]));
        setName("");
        setEmail("");
      }
      else if(dialogMode === "modify") {
        setAppointments(appointments.filter(e => e.id !== selection.id));
        setDialogMode("add");
      }
    }
    else if(calendarMode === "admin"){
      setAppointments(appointments.filter(e => e.id !== selection.id));
    }
    setD(new Date());
    setDialogOpen(false);
    setSelection("");
  }

  function updateWeek(step) {
    setWeekStart(new Date(weekStart.setDate(weekStart.getDate() + step)));
    setWeekEnd(new Date(weekEnd.setDate(weekEnd.getDate() + step)));
  }

  function handleAppointmentSearch() {
    setMessage("");
    if(Number(codeInput) === adminCode) {
      setCalendarMode("admin");
      setDialogMode("modify");
      setMessage("Vaihdettu ylläpitäjän näkymään.");
    }
    else if(appointments.some(e => e.id === Number(codeInput))) {
      setSelection(appointments.find(e => e.id === Number(codeInput)));
      setDialogMode("modify");
      setDialogOpen(true);
    }
    else{
      setMessage("Varausta ei löytynyt");
    }
    setCodeInput("");
  }

  function returnNormalMode() {
    setCalendarMode("normal");
    setDialogMode("add");
    setMessage("");
  }

  return (
    <div className={dialogOpen? "main-container main-container-disabled" : "main-container"}>
      <div>
        <label>Varauskoodi: </label>
        <input value={codeInput} onChange={({target}) => setCodeInput(target.value)}></input>
        <button onClick={handleAppointmentSearch}>Etsi varaus</button>
        <div>{message}</div>
        <button hidden={calendarMode === "admin" ? false : true} onClick={returnNormalMode}>Palaa normaalinäkymään</button>
      </div>
      <div className="calendar">
        <div className="calendar-title">
          <div onClick={() => updateWeek(-7)}>{lan === "fi-FI" ? "Edellinen viikko" : "Previous week"}</div>
          <h1>{weekStart.toLocaleDateString() + " - " + weekEnd.toLocaleDateString()}</h1>
          <div onClick={() => updateWeek(7)}>{lan === "fi-FI" ? "Seuraava viikko" : "Next week"}</div>
        </div>
        <Dialog 
          calendarMode={calendarMode}
          dialogOpen={dialogOpen}
          selection={selection}
          d={d}
          updateAppointments={updateAppointments}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          closeDialog={closeDialog}
          dialogMode={dialogMode}
        />
        <div className="calendar-grid">
          {weekDays.map(day => (
            <div key={day.title.getTime()}>
              <div className="grid-header">{dayFormat.format(day.title)}</div>
              <CalendarTimes 
                times={day.times}
                openDialog={openDialog}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function CalendarTimes(props) {
  return (
    <>
      {props.times.map(e => (
        <div key={e.title.getTime()} className={`time-item time-item-${e.status}`} onClick={() => props.openDialog(e.title)}>
          {e.title.getHours() < 10 ? `0${e.title.getHours()}:00` : `${e.title.getHours()}:00`}
        </div>
      ))}
    </>
  );
}

function Dialog(props) {

  if(props.dialogMode === "modify") {
    return (
      <dialog open={props.dialogOpen} className="dialog dialog-admin">
        <div>Varaus: {props.selection.time?.toLocaleString()}</div>
        <div>Varauskoodi: {props.selection.id}</div>
        <div>Varaajan tiedot: </div>
        <form onSubmit={props.updateAppointments}>
          <div>Nimi: <label>{props.selection.details?.name}</label></div>
          <div>Sähköposti: <label>{props.selection.details?.email}</label></div>
          <button type="submit">Poista varaus</button>
          <button type="reset" onClick={props.closeDialog}>Peruuta</button>
        </form>
      </dialog>
    );
  }
  else if(props.dialogMode === "add") {
    return (
      <dialog open={props.dialogOpen} className="dialog dialog-normal">
        <div>Valittu aika: {props.selection?.toLocaleString()}</div>
        <div>Varauskoodi: {props.d.getTime()}</div>
        <div>Varaajan tiedot: </div>
        <form onSubmit={props.updateAppointments}>
          <div>Nimi: <input value={props.name} required onChange={({target}) => props.setName(target.value)}></input></div>
          <div>Sähköposti: <input value={props.email} required onChange={({target}) => props.setEmail(target.value)}></input></div>
          <button type="submit">Vahvista varaus</button>
          <button type="reset" onClick={props.closeDialog}>Peruuta</button>
        </form>
      </dialog>
    );
  }
}


export default App;
