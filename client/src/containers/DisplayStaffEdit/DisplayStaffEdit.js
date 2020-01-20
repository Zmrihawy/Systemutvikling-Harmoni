import React, { Component } from 'react';
import StaffEdit from '../../components/StaffEdit/StaffEdit';

import { eventService } from '../../services';

export default class DisplayStaffEdit extends Component {
    state = {
        staff: []
    };

    handleNewStaff = () => {
        let staff = this.state.staff;
        staff.push({
            name: '',
            profession: '',
            contact: ''
        });

        this.setState({ staff });
    };


    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getCrew(eventId)
            .then(serverStaff => this.setState({ staff: serverStaff }))
            .catch(error => console.error(error));
    }

    render() {
        return <StaffEdit staff={this.state.staff} />;
    }
}
