import React, { Component } from 'react';

import RiderEdit from '../../components/RiderEdit/RiderEdit';

import { eventService } from '../../services';

/**
    Container for displaying the rider edit 
    The host of the event and the artist have access rights 
 */
export default class DisplayRiderEdit extends Component {
    initialRiders = {
        riders: []
    };

    state = {
        name: 'artist',
        riders: []
    };

    //Fetches the riders from the database
    async componentDidMount() {
        let eventId = this.props.match.params.eventId;
        let performanceId = this.props.match.params.performanceId;

        eventService
            .getPerformanceRiders(eventId, performanceId)
            .then(serverRiders => {
                if (serverRiders.length > 0) {
                    serverRiders.forEach((rider, i) => (rider.localId = i));
                    this.initialRiders = JSON.parse(
                        JSON.stringify(serverRiders)
                    );
                    this.setState({ riders: serverRiders });
                    this.setState({ name: serverRiders[0].performanceName });
                }
            })
            .catch(error => console.error(error));
    }

    //Triggered when an input field or checkbox is changed
    handleChange = e => {
        const newRiders = [...this.state.riders];

        const id = e.target.parentNode.id;

        if (e.target.type === 'checkbox')
            newRiders[id][e.target.name] = e.target.checked;
        else newRiders[id][e.target.name] = e.target.value;

        this.setState({ riders: newRiders });
    };

    //Triggered when the user clicks the '+' button
    handleButtonAddClick = e => {
        e.preventDefault();

        let riders = this.state.riders;
        console.log(riders);

        riders.push({
            id: null,
            name: '',
            amount: null,
            confirmed: null,
            performanceName: null
        });

        this.setState({ riders: riders });
    };

    //Triggered when the user clicks the '-' button
    handleButtonDeleteClick = e => {
        e.preventDefault();

        let riders = this.state.riders;
        const id = e.target.parentNode.id;
        riders.splice(id, 1);

        this.setState({ riders: riders });
    };

    //Triggered when the user clicks the 'Lagre endringer' button
    handleButtonSubmitClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil lagre endringene?'))
            return;

        let eventId = this.props.match.params.eventId;
        let performanceId = this.props.match.params.performanceId;

        let oldRiders = this.initialRiders.length > 0 ? this.initialRiders : [];
        let newRiders = this.state.riders;

        //List of users to add to the database
        let addList = newRiders.filter(rider => rider.id === null);

        //List of users to update in the database
        let updateList = [];
        oldRiders.forEach(oldRider => {
            newRiders.forEach(newRider => {
                if (oldRider.localId === newRider.localId) {
                    if (
                        oldRider.name !== newRider.name ||
                        oldRider.proffesion !== newRider.proffesion ||
                        oldRider.confirmed !== newRider.confirmed
                    ) {
                        newRider.oldName = oldRider.name;
                        updateList.push(newRider);
                    }
                }
            });
        });

        //List of users to delete from the database
        let deleteList = [];
        oldRiders.forEach(oldRider => {
            let shouldDelete = true;

            newRiders.forEach(newRider => {
                if (oldRider.localId === newRider.localId) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldRider);
        });

        let promises = [];

        //Adds the new artists to the database
        addList.map(rider => {
            let promise = eventService.createRider(
                performanceId,
                eventId,
                rider.name,
                rider.amount
            );

            promises.push(promise);

            return promise;
        });

        //Updates the artist who's attributes where changed
        updateList.map(rider => {
            let promise = eventService.updateRider(
                rider.oldName,
                performanceId,
                eventId,
                rider.name,
                rider.amount,
                rider.confirmed
            );

            promises.push(promise);

            return promise;
        });

        //Deletes the artists who were removed from the database
        deleteList.map(rider => {
            let promise = eventService.deleteRider(
                eventId,
                performanceId,
                rider.name
            );
            promises.push(promise);

            return promise;
        });
    };

    render() {
        return (
            <RiderEdit
                riders={this.state.riders}
                name={this.state.name}
                handleChange={this.handleChange}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                artistToken={sessionStorage.getItem('artist')}
            />
        );
    }
}
