import React from 'react';
import Calendar from 'react-calendar';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';

import classes from './Datepicker.module.scss';

const datePicker = props => {
    return (
        <div>
            <h3>Når skal arrangementet være?</h3>
            <Calendar
                selectRange={true}
                minDate={new Date()}
                value={[props.dates[0], props.dates[1]]}
                onChange={props.dateChanged}
            />
            <TimePicker
                minuteStep={5}
                id="timeFrom"
                style={{ width: 80 }}
                showSecond={false}
                defaultValue={props.times[0]}
                className={classes.TimePicker}
                onChange={(value, id = 'timeFrom') =>
                    props.timeChanged(value, id)
                }
            />
            <TimePicker
                minuteStep={5}
                id="timeTo"
                style={{ width: 80 }}
                showSecond={false}
                defaultValue={props.times[1]}
                className={classes.TimePicker}
                onChange={(value, id = 'timeTo') =>
                    props.timeChanged(value, id)
                }
            />
            <button onClick={props.last}>Forrige</button>
            <button onClick={props.next}>Videre</button>
        </div>
    );
};

export default datePicker;

// value={[props.dateFrom, props.dateTo]}
