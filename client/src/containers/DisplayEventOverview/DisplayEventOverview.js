import React, { Component } from 'react';

import EventOverview from '../../components/EventOverview/EventOverview';

import eventHolder from '../../pictures/eventPlaceholder.svg';
import Spinner from '../../components/UI/Spinner/Spinner';
import { eventService } from '../../services';
import { history } from '../App';

//Container for displaying all the events of an artist or host
export default class DisplayEventOverview extends Component {
    state = {
        activeEvents: [],
        archivedEvents: [],
        keyword: '',
        loading: true
    };

    //Fetches the events fro the database
    async componentDidMount() {
        let id = window.sessionStorage.getItem('user');
        let promises = [];

        //Acitve events
        promises.push(
            eventService
                .getUsersEvents(id, 1)
                .then(serverEvents => {
                    serverEvents.forEach(event => {
                        if (event.picture === '') event.picture = eventHolder;
                    });

                    this.setState({
                        activeEvents: serverEvents,
                        fullActive: serverEvents,
                        loading: false
                    });
                })
                .catch(error => console.error(error))
        );

        //Archived events
        promises.push(
            eventService
                .getUsersEvents(id, 0)
                .then(serverEvents => {
                    serverEvents.forEach(event => {
                        if (event.picture === '') event.picture = eventHolder;
                    });

                    this.setState({
                        archivedEvents: serverEvents,
                        fullArchive: serverEvents,
                        loading: false
                    });
                })
                .catch(error => console.error(error))
        );

        Promise.all(promises)
            .then(() => this.setState({ loading: false }))
            .catch(error => {
                console.error(error);
                window.alert('Kunne ikke hente data!');
            });
    }

    //Triggered when the user types a keyword in the searchbar
    handleSearch = e => {
        this.setState({ keyword: e.target.value });
    };

    //Triggered when the user clicks the 'Les mer' button
    handleButtonClick = id => {
        history.push('/arrangement/' + id);
    };

    render() {
        return !this.state.loading ? (
            <EventOverview
                activeEvents={this.state.activeEvents.filter(str =>
                    str.name
                        .toLowerCase()
                        .includes(this.state.keyword.toLowerCase())
                )}
                archivedEvents={this.state.archivedEvents.filter(str =>
                    str.name
                        .toLowerCase()
                        .includes(this.state.keyword.toLowerCase())
                )}
                handleButtonClick={this.handleButtonClick}
                handleSearch={this.handleSearch}
            />
        ) : (
            <Spinner />
        );
    }
}
