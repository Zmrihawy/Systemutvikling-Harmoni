import React, { Component } from 'react';
import ArtistEdit from '../../components/ArtistEdit/ArtistEdit';
import moment from 'moment';

import Spinner from '../../components/UI/Spinner/Spinner';
import { eventService, userService } from '../../services';
import { history } from '../App';

/**
    Container for displaying artist editing for an event 
    Only the host of the event has access rights 
 */
export default class DisplayArtistEdit extends Component {
    initialArtists = {
        registeredArtists: [],
        unregisteredArtists: []
    };

    state = {
        registeredArtists: [],
        unregisteredArtists: [],
        databaseArtists: [],
        loading: true
    };

    //Fetches artists from the database
    async componentDidMount() {
        let eventId = this.props.match.params.id;

        let promises = [];

        promises.push(
            eventService
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

                    this.initialArtists = JSON.parse(
                        JSON.stringify(this.state)
                    );
                })
                .catch(error => console.error(error))
        );

        promises.push(
            userService
                .getAllArtists()
                .then(serverArtists => {
                    this.setState({ databaseArtists: serverArtists });
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

    /**
        Handles input change 
        I.e. when name is changed of an unregistered artist)
    */
    handleInputChange = e => {
        e.preventDefault();

        const id = e.target.parentNode.id;

        let newArtists = [...this.state.unregisteredArtists];
        newArtists[id][e.target.name] = e.target.value;

        this.setState({ unregisteredArtists: newArtists });
    };

    /**
        Handles select change
        I.e. when a registered artist is added/removed
    */
    handleSelectChange = e => {
        e.preventDefault();

        const id = e.target.parentNode.id;

        let registeredArtists = [...this.state.registeredArtists];
        let databaseArtists = [...this.state.databaseArtists];

        let newArtist = databaseArtists.filter(
            artist => artist.id == e.target.value
        )[0];

        let duplicate = false;

        registeredArtists.forEach(artist => {
            if (artist.username == newArtist.username) {
                duplicate = true;
            }
        });

        if (newArtist.userId == null && newArtist.id != null)
            newArtist.userId = newArtist.id;

        if (!duplicate) {
            registeredArtists.splice(id, 1, newArtist);
            this.setState({ registeredArtists: registeredArtists });
        } else {
            alert('Artisten er allerede lagt til!');
        }
    };

    //Triggered when the user clicks the '+ button
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

    //Triggered when the user clicks the '- button
    handleButtonDeleteClick = (e, registered) => {
        let artists = [];

        if (registered) artists = this.state.registeredArtists;
        else artists = this.state.unregisteredArtists;

        const id = e.target.parentNode.id;

        artists.splice(id, 1);

        if (registered) this.setState({ registeredArtists: artists });
        else this.setState({ unregisteredArtists: artists });
    };

    //Triggered when the user clicks the 'Lagre endringer button
    handleButtonSubmitClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil lagre endringene?'))
            return;

        this.setState({ loading: true });

        let eventId = this.props.match.params.id;

        let oldArtists = this.initialArtists.unregisteredArtists.concat(
            this.initialArtists.registeredArtists
        );
        let newArtists = this.state.unregisteredArtists.concat(
            this.state.registeredArtists
        );

        //List of users to add to the database
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

        //List of users to update in the database
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

        //List of users to delete from the database
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

        //Adds the new artists to the database
        addList.forEach(artist => {
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

            promises.push(promise);
        });

        //Updates the artist who's attributes where changed
        updateList.forEach(artist => {
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

        //Delete the artist who were removed from the database
        deleteList.forEach(artist => {
            let promise = eventService.deletePerformance(eventId, artist.id);

            promises.push(promise);
        });

        //Redirects to the event page
        Promise.all(promises)
            .then(() => {
                window.alert('Endringene ble lagret!');
                history.push('/arrangement/' + eventId);
            })
            .catch(error => {
                console.error(error);
                window.alert('Teknisk feil!');
                history.push('/arrangement/' + eventId);
            });
    };

    //Triggered the user clicks the 'Gå tilbake' button
    handleButtonBackClick = e => {
        e.preventDefault();

        history.goBack();
    };

    render() {
        return !this.state.loading ? (
            <ArtistEdit
                registeredArtists={this.state.registeredArtists}
                unregisteredArtists={this.state.unregisteredArtists}
                databaseArtists={this.state.databaseArtists}
                handleButtonBackClick={this.handleButtonBackClick}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleTimeChange={this.handleTimeChange}
                handleInputChange={this.handleInputChange}
                handleSelectChange={this.handleSelectChange}
            />
        ) : (
            <Spinner />
        );
    }
}
