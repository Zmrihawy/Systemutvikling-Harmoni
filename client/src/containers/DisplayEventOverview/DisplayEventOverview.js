import React, { Component } from 'react';
import EventOverview from '../../components/EventOverview/EventOverview';

import { history } from '../App';

import {
    Event,
    Ticket,
    Crew,
    Performance,
    User,
    eventService,
    userService
} from '../../services';

export default class DisplayEventOverview extends Component {
    state = {
        activeEvents: [],
        archivedEvents: []
    };

    handleButtonClick = id => {
        history.push('/arrangement/' + id);
    };

    async componentDidMount() {
        let id = window.sessionStorage.getItem('user');

        eventService
            .getUsersEvents(id, 1)
            .then(serverEvents => {
                this.setState({ activeEvents: serverEvents });
            })
            .catch(error => console.error(error));

        eventService
            .getUsersEvents(id, 0)
            .then(serverEvents => {
                this.setState({ archivedEvents: serverEvents });
            })
            .catch(error => console.error(error));
    }

    render() {
        return (
            <EventOverview
                activeEvents={this.state.activeEvents}
                archivedEvents={this.state.archivedEvents}
                handleButtonClick={this.handleButtonClick}
            />
        );
    }
}
