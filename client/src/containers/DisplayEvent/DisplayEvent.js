import React, { Component } from 'react';
import EventInfo from '../../components/EventInfo/EventInfo';

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

    async componentDidMount() {
        let eventId = this.props.match.params.id;
        eventService
            .getEvent(eventId)
            .then(recivedEvent => {
                console.log(recivedEvent);
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
                    latitude: recivedEvent.latitude
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
    }

    handleRiderClick = e => {
        e.preventDefault();
        history.push('/arrangement/user/id/rider');
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
        let artists = [
            {
                name: 'Steven Kvinlaug',
                image:
                    'https://www.kvinesdal24.no/images/4817c829-a1f7-45b7-90cf-f3cbd4a64109?fit=crop&q=80&w=580'
            },
            {
                name: 'Torje Thorkildsen',
                image:
                    'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/11745966_900217626718522_810341310080559599_n.jpg?_nc_cat=104&_nc_ohc=43mIm-b8EL4AQkdvkWV2NG2ICSHhTl1jD40ytTi-0VN5UbCq6TY7nF-uQ&_nc_ht=scontent-arn2-1.xx&oh=1584203c5b173c3f55c7eeb033e331e8&oe=5E93BB8F'
            }
        ];

        return (
            <EventInfo
                title={this.state.title}
                description={this.state.description}
                location={this.state.location}
                longitude={this.state.longitude}
                latitude={this.state.latitude}
                dateFrom={this.state.dateFrom}
                dateTo={this.state.dateTo}
                host="Espen Kalleberg"
                ticketAmount={this.state.ticketAmount}
                artists={artists}
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
