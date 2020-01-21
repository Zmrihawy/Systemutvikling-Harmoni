import React, { Component } from 'react';
import Calendar from 'react-calendar';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import classes from './Datepicker.module.scss';
import Type from '../../components/UI/Type/Type';

export default class DatePicker extends Component {
    state = {
        timeFrom: this.props.timeFrom,
        timeTo: this.props.timeTo
    };

    handleTimeChange = (value, id) => {
        let time = this.state[id].split(' ');
        time[1] = value.format('HH:mm:ss');
        let newTime = time.join(' ');

        if (id === 'timeFrom') {
            this.setState({ timeFrom: newTime });
        } else {
            this.setState({ timeTo: newTime });
        }
    };

    handleDateChange = dates => {
        let state = {
            ...this.state
        };

        let timeFrom = state.timeFrom.split(' ');
        let timeTo = state.timeTo.split(' ');
        timeFrom[0] = this.formatDate(dates[0]);
        timeTo[0] = this.formatDate(dates[1]);
        timeFrom = timeFrom.join(' ');
        timeTo = timeTo.join(' ');

        this.setState({ timeFrom, timeTo });
    };

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        return (
            <>
                <div className="MediumTitle" style={{ marginBottom: '3rem' }}>
                    <Type
                        strings="Når skal arrangementet være?"
                        loop={false}
                        speed={50}
                    />
                </div>
                <div className={classes.DatePicker__options}>
                    <Calendar
                        selectRange={true}
                        minDate={new Date()}
                        value={[
                            new Date(this.state.timeFrom.replace(/-/g, '/')),
                            new Date(this.state.timeTo.replace(/-/g, '/'))
                        ]}
                        onChange={this.handleDateChange}
                    />
                    <div className={classes.DatePicker__times}>
                        <div>
                            Klokkeslett <i>til/fra</i>
                        </div>
                        <div>
                            <TimePicker
                                allowEmpty={false}
                                minuteStep={5}
                                id="timeFrom"
                                style={{ width: 80 }}
                                showSecond={false}
                                className={classes.TimePicker}
                                defaultValue={moment(this.state.timeFrom)}
                                onChange={(value, id = 'timeFrom') =>
                                    this.handleTimeChange(value, id)
                                }
                            />

                            <TimePicker
                                allowEmpty={false}
                                minuteStep={5}
                                id="timeTo"
                                style={{ width: 80 }}
                                showSecond={false}
                                className={classes.TimePicker}
                                defaultValue={moment(this.state.timeTo)}
                                onChange={(value, id = 'timeTo') =>
                                    this.handleTimeChange(value, id)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className={classes.DatePicker__buttons}>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                [this.state.timeFrom, this.state.timeTo],
                                'times',
                                'previous'
                            )
                        }
                    >
                        &larr; Tilbake
                    </button>
                    <button
                        autoFocus
                        className="Button"
                        onClick={() =>
                            this.props.save(
                                [this.state.timeFrom, this.state.timeTo],
                                'times',
                                'next'
                            )
                        }
                    >
                        Neste &rarr;
                    </button>
                </div>
            </>
        );
    }
}
