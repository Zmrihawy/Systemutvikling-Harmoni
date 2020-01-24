import React, { Component } from 'react';

import TicketEdit from '../../components/TicketEdit/TicketEdit';

import Spinner from '../../components/UI/Spinner/Spinner';
import { eventService } from '../../services';
import { history } from '../App';

/**
    Container for displaying the ticket edit
    The host of the event has access rights 
 */
export default class DisplayTicketEdit extends Component {
    initialTickets = {
        tickets: []
    };

    state = {
        tickets: [],
        loading: true
    };

    //Fetches tickets from the database
    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getEventTickets(eventId)
            .then(serverTickets => {
                let id = 1;
                serverTickets.map(ticket => (ticket.id = id++));

                this.initialTickets = JSON.parse(JSON.stringify(serverTickets));
                this.setState({ tickets: serverTickets });
                this.setState({ loading: false });
            })
            .catch(error => console.error(error));
    }

    //Triggered when an input field is changed
    handleChange = e => {
        const newTickets = [...this.state.tickets];

        const id = e.target.parentNode.id;

        newTickets[id][e.target.name] = e.target.value;

        this.setState({ tickets: newTickets });
    };

    //Triggered when the user clicks the '+' button
    handleButtonAddClick = e => {
        e.preventDefault();

        let tickets = this.state.tickets;

        tickets.push({
            name: '',
            price: '',
            amount: '',
            id: null
        });

        this.setState({ tickets: tickets });
    };

    //Triggered when the user clicks the '-' button
    handleButtonDeleteClick = e => {
        e.preventDefault();

        let tickets = this.state.tickets;
        const id = e.target.parentNode.id;
        tickets.splice(id, 1);

        this.setState({ tickets: tickets });
    };

    //Triggered when the user clicks the 'Lagre endringer' button
    handleButtonSubmitClick = e => {
        e.preventDefault();

        if (!window.confirm('Er du sikker på at du vil lagre endringene?'))
            return;

        this.setState({ loading: true });

        let eventId = this.props.match.params.id;

        let oldTickets = this.initialTickets;
        let newTickets = this.state.tickets;

        //List of users to add to the database
        let addList = newTickets.filter(ticket => ticket.id === null);

        //List of users to update in the database
        let updateList = [];
        oldTickets.forEach(oldTicket => {
            newTickets.forEach(newTicket => {
                if (oldTicket.id === newTicket.id) {
                    if (
                        oldTicket.name !== newTicket.name ||
                        oldTicket.price !== newTicket.price ||
                        oldTicket.amount !== newTicket.amount
                    ) {
                        newTicket.oldName = oldTicket.name;
                        updateList.push(newTicket);
                    }
                }
            });
        });

        //List of users to delete from the database
        let deleteList = [];
        oldTickets.forEach(oldTicket => {
            let shouldDelete = true;

            newTickets.forEach(newTicket => {
                if (oldTicket.id === newTicket.id) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldTicket);
        });

        let promises = [];

        //Adds the new artists to the database
        addList.map(ticket => {
            let promise = eventService.createTicket(
                ticket.name,
                eventId,
                ticket.price,
                ticket.amount
            );

            promises.push(promise);

            return promise;
        });

        //Updates the artist who's attributes where changed
        updateList.map(ticket => {
            let promise = eventService.updateTicket(
                ticket.oldName,
                ticket.name,
                eventId,
                ticket.price,
                ticket.amount
            );

            promises.push(promise);

            return promise;
        });

        //Deletes the artists who were removed from the database
        deleteList.map(ticket => {
            let promise = eventService.deleteTicket(ticket.name, eventId);
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
            <TicketEdit
                tickets={this.state.tickets}
                handleChange={this.handleChange}
                handleButtonBackClick={this.handleButtonBackClick}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
            />
        ) : (
            <Spinner />
        );
    }
}
