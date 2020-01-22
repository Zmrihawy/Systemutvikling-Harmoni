import React, { Component } from 'react';
import ArtistEdit from '../../components/ArtistEdit/ArtistEdit';
import moment from 'moment';

import { eventService, userService } from '../../services';

export default class DisplayArtistEdit extends Component {
    initialArtists = {
        registeredArtists: [],
        unregisteredArtists: []
    };

    state = {
        registeredArtists: [],
        unregisteredArtists: [],
        databaseArtists: []
    };

    async componentDidMount() {
        let eventId = this.props.match.params.id;

        const getEvent = eventService
            .getEventPerformances(eventId)
            .then(serverArtists => {
                serverArtists.forEach((artist, i) => {
                    artist.localId = i;
                });

                let unregisteredArtists = serverArtists.filter(
                    artist => artist.userId == undefined
                );
                let registeredArtists = serverArtists.filter(
                    artist => artist.userId != undefined
                );

                this.setState({
                    registeredArtists: registeredArtists,
                    unregisteredArtists: unregisteredArtists
                });

                this.initialArtists = JSON.parse(JSON.stringify(this.state));
            })
            .catch(error => console.error(error));

        userService
            .getAllArtists()
            .then(serverArtists => {
                this.setState({ databaseArtists: serverArtists });
            })
            .catch(error => console.error(error));
    }

    handleButtonAddClick = (e, registered) => {
        e.preventDefault();

        let artists;

        if (registered) artists = this.state.registeredArtists;
        else artists = this.state.unregisteredArtists;

        artists.push({
            userId: '', 
            name: ''
        });

        if (registered) this.setState({ registeredArtists: artists });
        else this.setState({ unregisteredArtists: artists });
    };

    handleButtonDeleteClick = (e, registered) => {
        let artists = [];

        if (registered) artists = this.state.registeredArtists;
        else artists = this.state.unregisteredArtists;

        const id = e.target.parentNode.id;

        artists.splice(id, 1);

        if (registered) this.setState({ registeredArtists: artists });
        else this.setState({ unregisteredArtists: artists });
    };

    handleButtonSubmitClick = e => {
        e.preventDefault();

        let eventId = this.props.match.params.id;

        let oldArtists = this.initialArtists.unregisteredArtists.concat(
            this.initialArtists.registeredArtists
        );
        let newArtists = this.state.unregisteredArtists.concat(
            this.state.registeredArtists
        );

        let addList = [];

        newArtists.forEach(newArtist => {
            let found = false;
            oldArtists.forEach(oldArtist => {
                if (oldArtist.id == newArtist.id) {
                    found = true;
                }
            });

            if (!found && newArtist.name != '') {
                addList.push(newArtist);
            }
        });

        let updateList = [];
        oldArtists.forEach(oldArtist => {
            newArtists.forEach(newArtist => {
                if (oldArtist.id == newArtist.id) {
                    if (oldArtist.name != newArtist.name) {
                        updateList.push(newArtist);
                    }
                }
            });
        });

        let deleteList = [];
        oldArtists.forEach(oldArtist => {
            let shouldDelete = true;

            newArtists.forEach(newArtist => {
                if (oldArtist.id == newArtist.id) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldArtist);
        });

        let promises = [];

        addList.map(artist => {
            artist.localId = 0;

            if (artist.name == null)
                artist.name = artist.firstName + ' ' + artist.surname;

            let promise = eventService.createPerformance(
                artist.id,
                eventId,
                moment()
                    .format()
                    .slice(0, -6),
                moment()
                    .format()
                    .slice(0, -6),
                artist.name
            );
        });

        deleteList.map(artist => {
            let promise = eventService.deletePerformance(eventId, artist.id);

            promises.push(promise);
        });

        updateList.map(artist => {
            let promise = eventService.updatePerformance(
                artist.id,
                eventId,
                moment()
                    .format()
                    .slice(0, -6),
                moment()
                    .format()
                    .slice(0, -6),
                artist.name
            );

            promises.push(promise);
        });

        //Promise.all(promises).then(history.push('/arrangement/' + eventId));
    };

    handleInputChange = e => {
        e.preventDefault();

        const id = e.target.parentNode.id;

        let newArtists = [...this.state.unregisteredArtists];
        newArtists[id][e.target.name] = e.target.value;

        this.setState({ unregisteredArtists: newArtists });
    };

    handleSelectChange = e => {
        e.preventDefault();

        const id = e.target.parentNode.id;

        let registeredArtists = [...this.state.registeredArtists];
        let databaseArtists = [...this.state.databaseArtists];

        let oldArtist = registeredArtists[id];
        let newArtist = databaseArtists.filter(
            artist => artist.id == e.target.value
        )[0];

        let duplicate = false;

        registeredArtists.forEach(artist => {
            if (artist.username == newArtist.username) {
                duplicate = true;
            }
        });

        if(newArtist.userId == null && newArtist.id != null)
            newArtist.userId = newArtist.id; 

        if (!duplicate) {
            registeredArtists.splice(id, 1, newArtist);
            this.setState({ registeredArtists: registeredArtists });
        } else {
            alert('Artisten er allerede lagt til!');
        }
        
    };

    render() {
        return (
            <ArtistEdit
                registeredArtists={this.state.registeredArtists}
                unregisteredArtists={this.state.unregisteredArtists}
                databaseArtists={this.state.databaseArtists}
                addnewArtists={this.addnewArtists}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleTimeChange={this.handleTimeChange}
                handleInputChange={this.handleInputChange}
                handleSelectChange={this.handleSelectChange}
            />
        );
    }
}
