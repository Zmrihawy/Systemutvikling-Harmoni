import React, { Component } from 'react';

import EventEdit from '../../components/EventEdit/EventEdit';

import Spinner from '../../components/UI/Spinner/Spinner';
import { eventService } from '../../services';
import { history } from '../App';

/**
    Container for displaying the event edit 
    The host of the event has access rights 
 */
export default class DisplayEventEdit extends Component {
    state = {
        event: {
            id: null,
            longitude: 10.421906,
            latitude: 63.446827,
            startTime: '2020-02-01 00:00:00',
            endTime: '2020-02-10 00:00:00'
        },
        loading: true
    };

    //fethces the event from the database
    async componentDidMount() {
        eventService
            .getEvent(this.props.match.params.id)
            .then(event => {
                event.startTime = event.startTime
                    .replace('Z', '')
                    .replace('T', ' ')
                    .slice(0, -4);
                event.endTime = event.endTime
                    .replace('Z', '')
                    .replace('T', ' ');

                this.setState({ event: event, loading: false });
            })
            .catch(error => console.error(error));
    }

    //Handles input change
    handleChange = e => {
        const event = {
            ...this.state.event,
            [e.target.name]: e.target.value
        };
        this.setState({ event });
    };

    //Handles date change in the calendar
    handleDateChange = dates => {
        let event = {
            ...this.state.event
        };

        let startTime = event.startTime.split(' ');
        let endTime = event.endTime.split(' ');
        startTime[0] = this.formatDate(dates[0]);
        endTime[0] = this.formatDate(dates[1]);
        startTime = startTime.join(' ');
        endTime = endTime.join(' ');
        event.startTime = startTime;
        event.endTime = endTime;

        this.setState({ event: event });
    };

    //Handles time change in the time picker
    handleTimeChange = (value, id) => {
        let event = this.state.event;
        let time =
            id === 'startTime'
                ? event.startTime.split(' ')
                : event.endTime.split(' ');

        time[1] = value.format('HH:mm:ss');
        let newTime = time.join(' ');

        id === 'startTime'
            ? (event.startTime = newTime)
            : (event.endTime = newTime);

        this.setState({ event: event });
    };

    //Formats the date correctly
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    /**
        Handles map click 
        I.e. puts a pin on the map on the
        location of the click 
     */
    handleMapClick = (map, e) => {
        let longitude = e.lngLat.lng;
        let latitude = e.lngLat.lat;

        let event = {
            ...this.state.event
        };

        event.latitude = latitude;
        event.longitude = longitude;

        this.setState({ event: event });
    };

    //Triggered the user clicks the 'Slett arrangement' button
    handleButtonDeleteClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil slette arrangementet?'))
            return;

        this.setState({ loading: true });

        eventService
            .deleteEvent(this.state.event.id)
            .then(() => {
                window.alert('Arrangementet ble slettet!');
                history.push('/arrangement');
            })
            .catch(error => {
                console.error(error);
                window.alert('Teknisk feil!');
                history.push('/arrangement');
            });
    };

    //Triggered the user clicks the 'Arkiver/Gjenopprett arrangement' button
    handleButtonArchiveClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil endre arrangementet?'))
            return;

        this.setState({ loading: true });

        let event = this.state.event;
        this.state.event.active === 1 ? (event.active = 0) : (event.active = 1);
        this.setState({ event: event });

        eventService
            .updateEvent(
                this.state.event.id,
                this.state.event.name,
                this.state.event.hostId,
                this.state.event.active,
                this.state.event.location,
                this.state.event.longitude,
                this.state.event.latitude,
                this.state.event.description,
                this.state.event.startTime,
                this.state.event.endTime
            )
            .then(() => {
                window.alert('Arrangementet ble endret!');
                history.push('/arrangement');
            })
            .catch(error => {
                console.error(error);
                window.alert('Teknisk feil!');
                history.push('/arrangement');
            });
    };

    //Triggered the user clicks the 'Lagre endringer' button
    handleButtonSubmitClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil lagre endringene?'))
            return;

        this.setState({ loading: true });

        eventService
            .updateEvent(
                this.state.event.id,
                this.state.event.name,
                this.state.event.hostId,
                this.state.event.active,
                this.state.event.location,
                this.state.event.longitude,
                this.state.event.latitude,
                this.state.event.description,
                this.state.event.startTime,
                this.state.event.endTime
            )
            .then(() => {
                window.alert('Endringene ble lagret!');
                history.push('/arrangement/' + this.state.event.id);
            })
            .catch(error => {
                console.error(error);
                window.alert('Teknisk feil!');
                history.push('/arrangement/' + this.state.event.id);
            });
    };

    //Triggered the user clicks the 'Gå tilbake' button
    handleButtonBackClick = e => {
        e.preventDefault();

        history.goBack();
    };

    render() {
        return !this.state.loading ? (
            <EventEdit
                event={this.state.event}
                handleButtonBackClick={this.handleButtonBackClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleButtonArchiveClick={this.handleButtonArchiveClick}
                handleDateChange={this.handleDateChange}
                handleTimeChange={this.handleTimeChange}
                handleChange={this.handleChange}
                handleMapClick={this.handleMapClick}
                longitude={this.state.event.longitude}
                latitude={this.state.event.latitude}
                location={this.state.event.location}
            />
        ) : (
            <Spinner />
        );
    }
}
