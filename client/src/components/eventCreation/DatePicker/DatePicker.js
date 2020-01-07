import React from 'react';
import Calendar from 'react-calendar';

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
            <button onClick={props.clicked}>Neste</button>
        </div>
    );
};

export default datePicker;

// value={[props.dateFrom, props.dateTo]}
