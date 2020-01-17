import React, { Component } from 'react';
import EventEdit from '../../components/EventEdit/EventEdit';

import { eventService } from '../../services';

import { history } from '../App';

export default class DisplayEventEdit extends Component {
    state = {
        event: {
            id: null,
            startTime: '2020-02-01 00:00:00.000',
            endTime: '2020-02-10 00:00:00.000', 
            longitude: '10.421906',
            latitude: '63.446827'
        }
    };

    handleChange = e => {
        const event = {
            ...this.state.event,
            [e.target.name]: e.target.value
        };
        this.setState({ event });
    };

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

        this.setState({ event });
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

    handleMapClick = (map, e) => {
        let longitude = e.lngLat.lng; 
        let latitude = e.lngLat.lat; 

        let event = {
            ...this.state.event
        };

        event.latitude = latitude; 
        event.longitude = longitude; 

        this.setState({ event: event })
    }

    async componentDidMount() {
        eventService
            .getEvent(this.props.match.params.id)
            .then(event => {
                event.startTime = event.startTime
                    .replace('Z', '')
                    .replace('T', ' ');
                event.endTime = event.endTime
                    .replace('Z', '')
                    .replace('T', ' ');
        console.log('neger');
                console.log(event);

                this.setState({ event });
            })
            .catch(error => console.error(error));
    }

    handleButtonClick = e => {
        e.preventDefault();
        eventService
            .updateEvent(
                this.state.event.id,
                this.state.event.name,
                this.state.event.hostId,
                this.state.event.active,
                this.state.event.location,
                this.state.event.description,
                this.state.event.startTime,
                this.state.event.endTime
            )
            .then(response => console.log(''))
            .catch(error => console.error(error));
    };

    render() {
        return (
            <EventEdit
                startTime={this.state.event.startTime}
                endTime={this.state.event.endTime}
                event={this.state.event}
                handleButtonClick={this.handleButtonClick}
                handleDateChange={this.handleDateChange}
                handleChange={this.handleChange}
                longitude={this.state.event.longitude}
                latitude={this.state.event.latitude}
                handleMapClick={this.handleMapClick}
            />
        );
    }
}
