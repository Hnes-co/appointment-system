# React Appointment System

## About

React component for a functional appointment system.
- Customizable appointment calendar that lists available times
- Separate views for normal user to pick appointments and for administrator to view and manage the appointments
- No user management, appointments are individualized based on unique appointment code
- Users can use the appointment code to search their appointment and delete the appointment
- Support for different appointment durations, available dates and times (see usage & props below)

## Install

```bash
npm install react-appointment-system
```

## Usage

```jsx
import React from 'react';
import AppointmentSystem from 'react-appointment-system';

function App() {
  const parameters = {
    durationOptions: [15, 30, 45, 60, 90],
    startTime: 8,
    endTime: 16,
    days: 7,
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

  const url = "your-server-url";

  const code = "your-custom-code1234";

  return (
    <div>
        <AppointmentSystem parameters={parameters} url={url} code={code}/>
    </div>
  );
}

export default App;
```

## Props

|             Name             |  Type  | Required |                                                             Description                                                            |
|:-----------------------------|:------:|:--------:|:-----------------------------------------------------------------------------------------------------------------------------------|
| `url`                        | string | `false`  | The url to your backend server, where the appointments will be saved.<br>If not provided, appointments will be saved only locally. |
| `code`                       | string | `false`  | The code that opens the administrator view. Typed in the search bar.<br>If you do not provide one, the default code is 1234567890. |
| `parameters`                 | object | `true`   | Parameters for the appointment calendar. Properties listed below.                                                                  |
| `parameters.durationOptions` | array  | `true`   | Appointment durations that are offered.<br>Duration in minutes.                                                                    |
| `parameters.startTime`       | number | `true`   | Time(hours, 0-23), when first appointment is offered                                                                               |
| `parameters.endTime`         | number | `true`   | Time(hours, 1-24), when appointment offering stops                                                                                 |
| `parameters.days`            | number | `true`   | How many days a week appointments are offered (1-7).<br>For example, if this is set at 5, appointments are offered mon-fri.        |
| `parameters.futureWeeks`     | number | `true`   | How many weeks into the future appointments are offered                                                                            |
| `parameters.exceptions`      | array  | `false`  | Exceptions to the above parameters. See below for more info                                                                        |

### About Exceptions
- Custom start/end times for certain days every week:<br>
**Example: Every weekend(saturday&sunday) start at 10.00 and end at 16.00**<br>

`
{
  days: [6,7],
  start: 10,
  end: 16
}
`

- Custom start/end time for a specific date:<br>
**Example: On 31/10/2022 start at 12.00 and end at 20.00**<br>
*Note that the month starts from 0*

`
{
  date: new Date(2022, 9, 31),
  start: 12,
  end: 20
}
`

## About the url and server connection 

It was designed for testing purposes to work with a Node.js server that uses MongoDB. 
The component uses Fetch API and has 3 functions, getAppointments, createAppointment and deleteAppointment.
If you provide the url and use it, it probably will not work with your setup. 
Perhaps this is further developed in the future or perhaps it's not.
Obviously you can clone the git repo and modify the functions to work for you.
If you want to see the server used for testing, you can find it here: [appointment-system-test-server](https://github.com/Hnes-co/appointment-system-test-server)
Feel free to use it.

## License

MIT @ [Hnes-co](https://github.com/Hnes-co)
