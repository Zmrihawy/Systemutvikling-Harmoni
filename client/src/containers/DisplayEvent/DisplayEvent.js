import React, { Component } from 'react';
import EventInfo from '../../components/EventInfo/EventInfo';
import profileHolder from '../../pictures/profileHolder.svg';

import {
    Event,
    Ticket,
    Crew,
    Performance,
    User,
    eventService,
    userService
} from '../../services';

import { faCommentDollar } from '@fortawesome/free-solid-svg-icons';

import { history } from '../App';

//TODO: Fix text responsiveness 
export default class DisplayEvent extends Component {
    state = {
        id: null,
        title: '',
        description: '',
        location: '',
        ticketAmount: null,
        image: '',
        dateFrom: null,
        dateTo: null,
        longitude: 10.421906,
        latitude: 63.446827,
        firstname: '',
        lastname: '',
        artists: [
            {
                id: '',
                name: '',
                riders: ['']
            }
        ],
        tickets: [
            {
                description: '',
                amount: null,
                price: null
            }
        ],
        staff: [
            {
                name: '',
                profession: '',
                number: ''
            }
        ]
    };

    //TODO: Clean up
    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getEvent(eventId)
            .then(recivedEvent => {
                this.setState({
                    id: recivedEvent.id,
                    title: recivedEvent.name,
                    description: recivedEvent.description,
                    location: recivedEvent.location,
                    dateFrom: new Date(recivedEvent.startTime)
                        .toUTCString()
                        .slice(0, -7),
                    dateTo: new Date(recivedEvent.endTime)
                        .toUTCString()
                        .slice(0, -7),
                    longitude: recivedEvent.longitude,
                    latitude: recivedEvent.latitude,
                    firstname: recivedEvent.firstName, 
                    lastname: recivedEvent.surname 
                });
            })
            .catch((error: Error) => console.log(error));

        const getTickets = tickets => {
            Promise.all(tickets.map(ticketConvert));
        };

        eventService
            .getEventTickets(eventId)
            .then(ticket_array => {
                this.setState({ tickets: ticket_array.map(ticketConvert) });
                let ticketCount = ticketcounter(ticket_array);
                this.setState({ ticketAmount: ticketCount });
            })
            .catch((error: Error) => console.error(error));

        function ticketcounter(tickets) {
            let ticketCount = 0;
            tickets.map(ticket => (ticketCount += ticket.amount));
            return ticketCount;
        }

        function ticketConvert(ticket) {
            return {
                description: ticket.name,
                amount: ticket.amount,
                price: ticket.price
            };
        }

        const getStaff = serv_staff => {
            Promise.all(staff.map(staffConvert));
        };

        let serv_staff = eventService.getCrew(eventId);
        let staff;

        function staffConvert(staff) {
            return {
                name: staff.name,
                profession: staff.profession,
                number: staff.contactInfo
            };
        }

        eventService
            .getCrew(eventId)
            .then(staff_array => {
                this.setState({ staff: staff_array.map(staffConvert) });
            })
            .catch((error: Error) => console.error(error));

        eventService
            .getEventPerformances(eventId)
            .then(artists => {
                artists.forEach(artist => {
                    if (artist.picture == '') artist.picture = profileHolder;
                });
                this.setState({ artists: artists });
            })
            .catch(error => console.error(error));
    }

    handleRiderClick = (e, performanceId) => {
        e.preventDefault();

        let eventId = this.props.match.params.id;

        history.push('/arrangement/' + eventId + '/rediger/rider/' + performanceId);
    };

    handleEditClick = () =>
        history.push('/arrangement/' + this.state.id + '/rediger');

    handleArtistEditClick = e => {
        e.preventDefault();
        history.push('/arrangement/' + this.state.id + '/rediger/artister');
    };

    handleTicketEditClick = e => {
        e.preventDefault();
        history.push('/arrangement/' + this.state.id + '/rediger/billetter');
    };

    handleStaffEditClick = e => {
        e.preventDefault();
        history.push('/arrangement/' + this.state.id + '/rediger/personell');
    };

    render() {
        return (
            <EventInfo
                title={this.state.title}
                description={this.state.description}
                location={this.state.location}
                longitude={this.state.longitude}
                latitude={this.state.latitude}
                dateFrom={this.state.dateFrom}
                dateTo={this.state.dateTo}
                host={this.state.firstname + ' ' + this.state.lastname}
                ticketAmount={this.state.ticketAmount}
                artists={this.state.artists}
                handleRiderClick={this.handleRiderClick}
                handleEditClick={this.handleEditClick}
                tickets={this.state.tickets}
                staff={this.state.staff}
                handleArtistEditClick={this.handleArtistEditClick}
                handleTicketEditClick={this.handleTicketEditClick}
                handleStaffEditClick={this.handleStaffEditClick}
            />
        );
    }
}
