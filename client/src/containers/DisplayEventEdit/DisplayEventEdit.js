import React, { Component } from 'react';
import EventEdit from '../../components/EventEdit/EventEdit';

import {
    eventService,
} from '../../services';

import { history } from '../App';

export default class DisplayEventEdit extends Component {
    state = {
        event: '' 
    };

    async componentDidMount() {
        eventService.getEvent(this.props.match.params.id)
        .then(event => {
            this.setState({event})
        }).catch(error => console.error(error));
    }

    handleButtonClick = (e) => {
        e.preventDefault(); 
        console.log('push to db')
        //history.push('/arrangement/user/id/rider'); 
    }
    

    render() {
        return (
            <EventEdit 
            event={this.state.event}
            handleButtonClick={this.handleButtonClick}/>
        );
    }
}
