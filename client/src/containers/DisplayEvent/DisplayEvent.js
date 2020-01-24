import React, { Component } from 'react';

import EventInfo from '../../components/EventInfo/EventInfo';

import profileHolder from '../../pictures/profileHolder.svg';
import Spinner from '../../components/UI/Spinner/Spinner';
import { eventService } from '../../services';
import { history } from '../App';

/**
    Container for displaying an event
    The host of the event and artists have access rights
 */
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
        loading: true,
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

    //Fetches event, artists, staff and tickets from the database
    async componentDidMount() {
        let eventId = this.props.match.params.id;
        let promises = []; 

        //Fetches event from database
        promises.push(eventService
            .getEvent(eventId)
            .then(serverEvent => {
                this.setState({
                    id: serverEvent.id,
                    title: serverEvent.name,
                    description: serverEvent.description,
                    location: serverEvent.location,
                    dateFrom: new Date(serverEvent.startTime)
                        .toUTCString()
                        .slice(0, -7),
                    dateTo: new Date(serverEvent.endTime)
                        .toUTCString()
                        .slice(0, -7),
                    longitude: serverEvent.longitude,
                    latitude: serverEvent.latitude,
                    firstname: serverEvent.firstName,
                    lastname: serverEvent.surname,
                    loading: false
                });
            })
            .catch((error: Error) => console.error(error)));

        //Fetches performanes (artists) from database
        promises.push(eventService
            .getEventPerformances(eventId)
            .then(serverArtists => {
                serverArtists.forEach(artist => {
                    if (artist.picture === '') artist.picture = profileHolder;
                });

                this.setState({ artists: serverArtists });
            })
            .catch(error => console.error(error)));

        //Fetches tickets from database
        promises.push(eventService
            .getEventTickets(eventId)
            .then(serverTickets => {
                this.setState({
                    tickets: serverTickets.map(ticket => {
                        return {
                            description: ticket.name,
                            amount: ticket.amount,
                            price: ticket.price
                        };
                    })
                })

                let ticketAmount = 0;
                serverTickets.forEach(
                    ticket => (ticketAmount += ticket.amount)
                );
                this.setState({ ticketAmount: ticketAmount });
            })
            .catch((error: Error) => console.error(error)));

        //Fetches staff from database
        promises.push(eventService
            .getCrew(eventId)
            .then(serverStaff => {
                this.setState({
                    staff: serverStaff.map(staff => {
                        return {
                            name: staff.name,
                            profession: staff.profession,
                            number: staff.contactInfo
                        };
                    })
                });
            })
            .catch((error: Error) => console.error(error)));

        Promise.all(promises)
            .then(() => this.setState({ loading: false }))
            .catch(error => {
                console.error(error);
                window.alert('Kunne ikke hente data!');
            });
    }

    //Triggered when the user clicks the 'Rider' button
    handleRiderClick = (e, performanceId) => {
        e.preventDefault();

        let eventId = this.props.match.params.id;

        history.push(
            '/arrangement/' + eventId + '/rediger/rider/' + performanceId
        );
    };

    //Triggered when the user clicks the 'Rediger arrangement' button
    handleEditClick = () =>
        history.push('/arrangement/' + this.state.id + '/rediger');

    //Triggered when the user clicks the 'Rediger' artister button
    handleArtistEditClick = e => {
        e.preventDefault();
        history.push('/arrangement/' + this.state.id + '/rediger/artister');
    };
    //Triggered when the user clicks the 'Rediger' ticket button
    handleTicketEditClick = e => {
        e.preventDefault();
        history.push('/arrangement/' + this.state.id + '/rediger/billetter');
    };
    //Triggered when the user clicks the 'Rediger' staff button
    handleStaffEditClick = e => {
        e.preventDefault();
        history.push('/arrangement/' + this.state.id + '/rediger/personell');
    };

     //Triggered the user clicks the 'Gå tilbake' button
    handleButtonBackClick = e => {
        e.preventDefault();

        history.goBack();
    };

    render() {
        return !this.state.loading ? (
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
                handleButtonBackClick={this.handleButtonBackClick}
                artistToken={parseInt(sessionStorage.getItem('artist'))}
                eventId={this.state.id}
            />
        ) : (
            <Spinner />
        );
    }
}
