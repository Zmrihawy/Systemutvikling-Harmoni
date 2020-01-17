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
        events: []
    };

    handleButtonClick = id => {
        history.push('/arrangement/' + id);
    };

    async componentDidMount() {
        let id = window.sessionStorage.getItem('user')
        
        eventService
            .getUsersEvents(id, 1)
            .then(serverEvents => {
                this.setState({ events: serverEvents });
            })
            .catch(error => console.error(error));
    }

    render() {
        return (
            <EventOverview
                events={this.state.events}
                handleButtonClick={this.handleButtonClick}
            />
        );
    }
}
