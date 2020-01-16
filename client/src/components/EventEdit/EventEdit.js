import React from 'react';

import classes from '../EventEdit/EventEdit.module.scss';

import DatePicker from '../../containers/DatePicker/DatePicker'; 
import Calendar from 'react-calendar';

const eventEdit = props => {
    console.log(props.event);
    return (
        <form className={classes.container} onSubmit={props.handleButtonClick}>
            <h1 className={classes.title}>Rediger arrangement</h1>

            <input
                className={classes.input__name}
                type="text"
                name="name"
                value={props.event.name}
                onChange={props.handleChange}
            />
            <input
                className={classes.input__location}
                type="text"
                name="location"
                value={props.event.location}
                onChange={props.handleChange}
            />
            <Calendar
                    selectRange={true}
                    minDate={new Date()}
                    value={[
                        new Date(props.startTime.replace(/-/g, '/')),
                        new Date(props.endTime.replace(/-/g, '/'))
                    ]}
                    onChange={props.handleDateChange}
                />
            <textarea
                className={classes.input__description}
                name="description"
                value={props.event.description}
                onChange={props.handleChange}
            />

            <input
                className={classes.button__submit}
                type="submit"
                value="Endre arrangement"
            />
        </form>
    );
};

export default eventEdit;