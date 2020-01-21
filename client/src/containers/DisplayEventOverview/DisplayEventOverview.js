import React, { Component } from 'react';
import EventOverview from '../../components/EventOverview/EventOverview';
import Spinner from '../../components/UI/Spinner/Spinner';

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
        archivedEvents: [],
        keyword: '',
        loading: true
    };

    handleSearch = e => {
        this.setState({ keyword: e.target.value });
    };

    handleButtonClick = id => {
        history.push('/arrangement/' + id);
    };

    async componentDidMount() {
        let id = window.sessionStorage.getItem('user');

        eventService
            .getUsersEvents(id, 1)
            .then(serverEvents => {
                this.setState({
                    activeEvents: serverEvents,
                    fullActive: serverEvents,
                    loading: false
                });
            })
            .catch(error => console.error(error));

        eventService
            .getUsersEvents(id, 0)
            .then(serverEvents => {
                this.setState({
                    archivedEvents: serverEvents,
                    fullArchive: serverEvents
                });
            })
            .catch(error => console.error(error));
    }

    render() {
        let output;

        return !this.state.loading ? (
            (output = (
                <EventOverview
                    activeEvents={this.state.activeEvents.filter(str =>
                        str.name.toLowerCase().includes(this.state.keyword)
                    )}
                    archivedEvents={this.state.archivedEvents.filter(str =>
                        str.name.toLowerCase().includes(this.state.keyword)
                    )}
                    handleButtonClick={this.handleButtonClick}
                    handleSearch={this.handleSearch}
                />
            ))
        ) : (
            <Spinner />
        );
    }
}
