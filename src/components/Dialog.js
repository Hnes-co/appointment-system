import React from "react";

function Dialog(props) {

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  function handleInputChange({target}) {
    props.setDetails({
      ...props.details,
      [target.name]: target.value
    });
  }

  if(props.dialogMode === "modify") {
    return (
      <dialog open={props.dialogOpen} className="dialog dialog-admin">
        <div className="dialog-header">Manage appointment</div>
        <div className="dialogContent">
          <div className="dialogContent-top">
            <label>Appointment date: <label>{props.selection.time?.toLocaleString([], options)}</label></label>
            <label>Duration: <label>{props.selection.duration} min</label></label>
            <label>Appointment code: <label>{props.selection._id}</label></label>
          </div>
          <form onSubmit={props.updateAppointments}>
            <div className="dialogContent-middle">
              <div>Name: <label>{props.selection.details?.name}</label></div>
              <div>Email: <label>{props.selection.details?.email}</label></div>
              <div>Additional info: <label>{props.selection.details?.notes}</label></div>
            </div>
            <div className="dialogContent-bottom">
              <button className="calendar-button dialog-button" type="submit">Delete Appointment</button>
              <button className="calendar-button dialog-button" type="reset" onClick={props.closeDialog}>Cancel</button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
  else if(props.dialogMode === "add") {
    return (
      <dialog open={props.dialogOpen} className="dialog dialog-normal">
        <div className="dialog-header">New appointment</div>
        <div className="dialogContent">
          <div className="dialogContent-top">
            <label>Selected date: <label>{props.selection?.toLocaleString([], options)}</label></label>
            <label>Duration: <label>{props.duration} min</label></label>
            <label>Appointment code: <label>{props.appointmentID}</label></label>
          </div>
          <form onSubmit={props.updateAppointments}>
            <div className="dialogContent-middle">
                <div>Name:
                  <input name="name" value={props.details.name} required maxLength={30} onChange={handleInputChange}/>
                </div>
                <div>Email:
                  <input name="email" value={props.details.email} required maxLength={50} onChange={handleInputChange}/>
                </div>
                <div>Additional info:
                  <textarea name="notes" value={props.details.notes} maxLength={100} onChange={handleInputChange}/>
                </div>
              </div>
            <div className="dialogContent-bottom">
              <button className="calendar-button dialog-button" type="submit">Confirm Appointment</button>
              <button className="calendar-button dialog-button" type="reset" onClick={props.closeDialog}>Cancel</button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
}

export default Dialog;
  