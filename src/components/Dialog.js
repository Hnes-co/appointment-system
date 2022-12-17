import React from "react";

function Dialog(props) {

  function handleInputChange({ target }) {
    props.details.current = { ...props.details.current, [target.name]: target.value };
  }

  if(props.dialogMode === "examine") {
    return (
      <dialog ref={props.dialogOpen} className="dialog dialog-admin">
        <h3 className="dialog-header">Manage appointment</h3>
        <div className={props.handleResizeClass("dialogContent")}>
          <div className="dialogContent-top">
            <label>Appointment date: <label>{props.selection.time?.toLocaleString([], props.options)}</label></label>
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
              <button className={props.handleResizeClass("calendar-button dialog-button")} type="submit">
                Delete Appointment
              </button>
              <button className={props.handleResizeClass("calendar-button dialog-button")} type="reset" onClick={props.closeDialog}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
  else if(props.dialogMode === "add") {
    return (
      <dialog ref={props.dialogOpen} className="dialog dialog-normal">
        <h3 className="dialog-header">New appointment</h3>
        <div className={props.handleResizeClass("dialogContent")}>
          <div className="dialogContent-top">
            <label>Selected date: <label>{props.selection?.toLocaleString([], props.options)}</label></label>
            <label>Duration: <label>{props.duration} min</label></label>
            <label>Appointment code: <label>{props.appointmentID.current}</label></label>
          </div>
          <form onSubmit={props.updateAppointments}>
            <div className={props.handleResizeClass("dialogContent-middle")}>
              <div>Name:
                <input name="name" type="text" required maxLength={30} onChange={handleInputChange} />
              </div>
              <div>Email:
                <input name="email" type="email" required maxLength={50} onChange={handleInputChange} />
              </div>
              <div>Additional info:
                <textarea name="notes" type="text" maxLength={100} onChange={handleInputChange} />
              </div>
            </div>
            <div className="dialogContent-bottom">
              <button className={props.handleResizeClass("calendar-button dialog-button")} type="submit">
                Confirm
              </button>
              <button className={props.handleResizeClass("calendar-button dialog-button")} type="reset" onClick={props.closeDialog}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
}

export default Dialog;
