import React, { Component } from 'react';
import StaffEdit from '../../components/StaffEdit/StaffEdit';

import { eventService } from '../../services';
import { history } from '../App';

export default class DisplayStaffEdit extends Component {
    initialStaff = {
        staff: []
    };

    state = {
        staff: []
    };

    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getCrew(eventId)
            .then(serverStaff => {
                this.initialStaff = JSON.parse(JSON.stringify(serverStaff));
                this.setState({ staff: serverStaff });
            })
            .catch(error => console.error(error));
    }

    handleButtonAddClick = e => {
        e.preventDefault();

        let state = this.state;

        state.staff.push({
            id: null,
            name: '',
            profession: '',
            contactInfo: ''
        });

        this.setState({ state });
    };

    handleButtonSubmitClick = e => {
        e.preventDefault();
        let eventId = this.props.match.params.id;

        let oldStaff = this.initialStaff;
        let newStaff = this.state.staff;

        let addList = newStaff.filter(person => person.id == null);

        let updateList = [];

        oldStaff.forEach(oldPerson => {
            newStaff.forEach(newPerson => {
                if (oldPerson.id == newPerson.id) {
                    if (
                        oldPerson.name != newPerson.name ||
                        oldPerson.proffesion != newPerson.proffesion ||
                        oldPerson.contactInfo != newPerson.contactInfo
                    ) {
                        updateList.push(newPerson);
                    }
                }
            });
        });

        let deleteList = [];

        oldStaff.forEach(oldPerson => {
            let shouldDelete = true;

            newStaff.forEach(newPerson => {
                if (oldPerson.id == newPerson.id) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldPerson);
        });

        let promises = [];

        addList.map(person => {
            let promise = eventService.createCrew(
                eventId,
                person.profession,
                person.name,
                person.contactInfo
            );

            promises.push(promise);
        });

        updateList.map(person => {
            let promise = eventService.updateCrew(
                'old',
                eventId,
                person.id,
                person.profession,
                person.name,
                person.contactInfo
            );

            promises.push(promise);
        });

        deleteList.map(person => {
            let promise = eventService.deleteCrew(eventId, person.id);
            promises.push(promise);
        });

        Promise.all(promises).then(history.push('/arrangement/' + eventId));
    };

    handleButtonDeleteClick = e => {
        e.preventDefault();

        let staff = this.state.staff;
        const id = e.target.parentNode.id;
        staff.splice(id, 1);

        this.setState({ staff: staff });
    };

    handleChange = e => {
        const newStaff = [...this.state.staff];

        const id = e.target.parentNode.id;

        newStaff[id][e.target.name] = e.target.value;

        this.setState({ staff: newStaff });
    };

    render() {
        return (
            <StaffEdit
                staff={this.state.staff}
                addNewStaff={this.addNewStaff}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleChange={this.handleChange}
            />
        );
    }
}
