import React from 'react';

import classes from '../EventEdit/EventEdit.module.scss';

import 'rc-time-picker/assets/index.css';
import TimePicker from 'rc-time-picker';
import Calendar from 'react-calendar';
import Map from '../Map/Map';
import moment from 'moment';

//Component for editing an event
const eventEdit = props => {
    return (
        <form
            className={classes.container}
            onSubmit={props.handleButtonSubmitClick}
        >
            <input
                className={`${classes.button__back} ${'Button'}`}
                type="button"
                value="&larr; Tilbake"
                onClick={props.handleButtonBackClick}
            />
            <h1 className={classes.title}>Rediger arrangement</h1>

            <input
                className={`${classes.input__name} ${'Input'}`}
                type="text"
                name="name"
                value={props.event.name}
                onChange={props.handleChange}
            />
            <input
                className={`${classes.input__location} ${'Input'}`}
                type="text"
                name="location"
                value={props.event.location}
                onChange={props.handleChange}
            />
            <Calendar
                className={classes.calendar}
                selectRange={true}
                minDate={new Date()}
                value={[
                    new Date(props.event.startTime.replace(/-/g, '/')),
                    new Date(props.event.endTime.replace(/-/g, '/'))
                ]}
                onChange={props.handleDateChange}
            />
            <TimePicker
                className={classes.timepicker__start}
                allowEmpty={false}
                minuteStep={5}
                id="startTime"
                showSecond={false}
                value={moment(props.event.startTime)}
                defaultValue={moment(props.event.startTime)}
                onChange={(value, id = 'startTime') =>
                    props.handleTimeChange(value, id)
                }
            />
            <TimePicker
                className={classes.timepicker__end}
                allowEmpty={false}
                minuteStep={5}
                id="endTime"
                showSecond={false}
                value={moment(props.event.endTime)}
                defaultValue={moment(props.event.endTime)}
                onChange={(value, id = 'endTime') =>
                    props.handleTimeChange(value, id)
                }
            />
            <div className={classes.map}>
                <Map
                    longitude={props.longitude}
                    latitude={props.latitude}
                    location={props.location}
                    handleMapClick={props.handleMapClick}
                />
            </div>
            <textarea
                className={`${classes.input__description} ${'Input'}`}
                name="description"
                value={props.event.description}
                onChange={props.handleChange}
            />
            <input
                className={`${classes.button__archive} ${'Button'}`}
                type="button"
                value={
                    props.event.active === 1
                        ? 'Arkiver arrangement'
                        : 'Gjenopprett arrangement'
                }
                onClick={props.handleButtonArchiveClick}
            />
            <input
                className={`${classes.button__delete} ${'Button'}`}
                type="button"
                value="Slett arrangement"
                onClick={props.handleButtonDeleteClick}
            />
            <input
                className={`${classes.button__submit} ${'Button'}`}
                type="submit"
                value="Lagre endringer"
            />
        </form>
    );
};

export default eventEdit;
