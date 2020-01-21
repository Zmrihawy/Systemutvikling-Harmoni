import React, { Component } from 'react';
import StaffEdit from '../../components/StaffEdit/StaffEdit';

import { eventService } from '../../services';

export default class DisplayStaffEdit extends Component {
    initialStaff = {
        staff: []
    } 

    state = {
        staff: []
    };

    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getCrew(eventId)
            .then(serverStaff => {
                    

                serverStaff.push({
                    name: 'asd',
                    proffesion: 'asd',
                    contactInfo: 'asd'
                });

                this.initialStaff = serverStaff;
                this.setState({ staff: serverStaff }); 
            })
            .catch(error => console.error(error));
    }

    handleButtonAddClick = e => {
        e.preventDefault();

        let state = this.state;

        state.staff.push({
            name: '',
            proffesion: '',
            contactInfo: ''
        });

        this.setState({ state });
    };

    handleButtonSubmitClick = e => {
        e.preventDefault();
        console.log('submit');
    };

    handleButtonDeleteClick = e => {
        e.preventDefault();
        let state = this.state;

        state.staff.pop();

        this.setState({ state });
    };

    handleChange = e => {
        const newStaff = [ ...this.state.staff ];

        const id = e.target.parentNode.id; 

        newStaff[id][e.target.name] = e.target.value; 

        this.setState({ staff:  newStaff });
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
