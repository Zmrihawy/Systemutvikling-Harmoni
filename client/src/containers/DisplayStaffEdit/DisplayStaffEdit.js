import React, { Component } from 'react';

import StaffEdit from '../../components/StaffEdit/StaffEdit';

import Spinner from '../../components/UI/Spinner/Spinner';
import { eventService } from '../../services';
import { history } from '../App';

/**
    Container for displaying the staff edit 
    The host of the event has access rights 
 */
export default class DisplayStaffEdit extends Component {
    initialStaff = {
        staff: []
    };

    state = {
        staff: [],
        loading: true
    };

    //Fetches the staff from the databse
    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getCrew(eventId)
            .then(serverStaff => {
                this.initialStaff = JSON.parse(JSON.stringify(serverStaff));
                this.setState({ staff: serverStaff, loading: false });
            })
            .catch(error => console.error(error));
    }

    //Triggered when an input field is changed
    handleChange = e => {
        const newStaff = [...this.state.staff];

        const id = e.target.parentNode.id;

        newStaff[id][e.target.name] = e.target.value;

        this.setState({ staff: newStaff });
    };

    //Triggered when the user clicks the '+' button
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

    //Triggered when the user clicks the '-' button
    handleButtonDeleteClick = e => {
        e.preventDefault();

        let staff = this.state.staff;
        const id = e.target.parentNode.id;
        staff.splice(id, 1);

        this.setState({ staff: staff });
    };

    //Triggered when the user clicks the 'Lagre endringer' button
    handleButtonSubmitClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil lagre endringene?'))
            return;

        this.setState({ loading: true });

        let eventId = this.props.match.params.id;

        let oldStaff = this.initialStaff;
        let newStaff = this.state.staff;

        //List of users to add to the database
        let addList = newStaff.filter(person => person.id === null);

        //List of users to update in the database
        let updateList = [];
        oldStaff.forEach(oldPerson => {
            newStaff.forEach(newPerson => {
                if (oldPerson.id === newPerson.id) {
                    if (
                        oldPerson.name !== newPerson.name ||
                        oldPerson.proffesion !== newPerson.proffesion ||
                        oldPerson.contactInfo !== newPerson.contactInfo
                    ) {
                        updateList.push(newPerson);
                    }
                }
            });
        });

        //List of users to delete from the database
        let deleteList = [];
        oldStaff.forEach(oldPerson => {
            let shouldDelete = true;

            newStaff.forEach(newPerson => {
                if (oldPerson.id === newPerson.id) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldPerson);
        });

        let promises = [];

        //Adds the new artists to the database
        addList.map(person => {
            let promise = eventService.createCrew(
                eventId,
                person.profession,
                person.name,
                person.contactInfo
            );

            promises.push(promise);

            return promise;
        });

        //Updates the artist who's attributes where changed
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

            return promise;
        });

        //Deletes the artists who were removed from the database
        deleteList.map(person => {
            let promise = eventService.deleteCrew(eventId, person.id);
            promises.push(promise);
            return promise;
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
            <StaffEdit
                staff={this.state.staff}
                handleChange={this.handleChange}
                handleButtonBackClick={this.handleButtonBackClick}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
            />
        ) : (
            <Spinner />
        );
    }
}
