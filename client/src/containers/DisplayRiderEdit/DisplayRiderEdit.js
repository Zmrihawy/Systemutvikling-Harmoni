import React, { Component } from 'react';
import RiderEdit from '../../components/RiderEdit/RiderEdit';

import { eventService } from '../../services';
import { history } from '../App';

export default class DisplayRiderEdit extends Component {
    initialRiders = {
        riders: []
    };

    state = {
        name: '',
        riders: []
    };

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

    handleButtonSubmitClick = e => {
        e.preventDefault();

        let eventId = this.props.match.params.eventId;
        let performanceId = this.props.match.params.performanceId;

        let oldRiders = this.initialRiders;
        let newRiders = this.state.riders;

        let addList = newRiders.filter(rider => rider.id == null);

        let updateList = [];
        oldRiders.forEach(oldRider => {
            newRiders.forEach(newRider => {
                if (oldRider.localId == newRider.localId) {
                    if (
                        oldRider.name != newRider.name ||
                        oldRider.proffesion != newRider.proffesion ||
                        oldRider.confirmed != newRider.confirmed
                    ) {
                        newRider.oldName = oldRider.name;
                        updateList.push(newRider);
                    }
                }
            });
        });

        console.log(this.state); 

        let deleteList = [];
        oldRiders.forEach(oldRider => {
            let shouldDelete = true;

            newRiders.forEach(newRider => {
                if (oldRider.localId == newRider.localId) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldRider);
        });

        let promises = [];

        addList.map(rider => {
            let promise = eventService.createRider(
                performanceId,
                eventId,
                rider.name,
                rider.amount
            );

            promises.push(promise);
        });

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
        });

        deleteList.map(rider => {
            let promise = eventService.deleteRider(
                eventId,
                performanceId,
                rider.name
            );
            promises.push(promise);
        });
    };

    handleButtonDeleteClick = e => {
        e.preventDefault();

        let riders = this.state.riders;
        const id = e.target.parentNode.id;
        riders.splice(id, 1);

        this.setState({ riders: riders });
    };

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

    handleChange = e => {
        const newRiders = [...this.state.riders];

        const id = e.target.parentNode.id;

        if(e.target.type == 'checkbox')
            newRiders[id][e.target.name] = e.target.checked;
        else 
            newRiders[id][e.target.name] = e.target.value;

        this.setState({ riders: newRiders });
    };

    render() {
        return (
            <RiderEdit
                riders={this.state.riders}
                name={this.state.name}
                addNewRider={this.addNewRider}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleChange={this.handleChange}
            />
        );
    }
}
