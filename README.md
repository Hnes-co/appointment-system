# React Appointment System

## About

React component for a fully functional appointment system.
- Includes a customizable appointment calendar,
- Separate views for normal user to pick appointments and for administrator to view the appointments
- Support for different appointment durations and available dates (see usage & props below)

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
    days: 5,
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

  const url = "http://your-server-url/api/appointments";

  return (
    <div>
        <AppointmentSystem parameters={parameters} url={url}/>
    </div>
  );
}

export default App;
```

## Props

|             Name             |  Type  | Required |                                                             Description                                                            |
|:----------------------------:|:------:|:--------:|:----------------------------------------------------------------------------------------------------------------------------------:|
| `url`                        | string | `false`  | The url to your backend server, where the appointments will be saved.<br>If not provided, appointments will be saved only locally. |
| `parameters`                 | object | `true`   | Parameters for the appointment calendar. Properties listed below.                                                                  |
| `parameters.durationOptions` | array  | `true`   | Appointment durations that are offered.<br>Duration in minutes, separate durations with comma.                                     |
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
**Example: On 31/10/2022 start at 10.00 and end at 16.00**<br>
*Note that the month starts from 0*

`
{
  date: new Date(2022, 9, 31),
  start: 12,
  end: 20
}
`

## License

MIT @ [Hnes-co](https://github.com/Hnes-co)
