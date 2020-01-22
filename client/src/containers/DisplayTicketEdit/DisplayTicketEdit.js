import React, { Component } from 'react';
import TicketEdit from '../../components/TicketEdit/TicketEdit';

import { eventService } from '../../services';

import { history } from '../App'; 

export default class DisplayTicketEdit extends Component {
    initialTickets = {
        tickets: []
    };

    state = {
        tickets: []
    };

    async componentDidMount() {
        let eventId = this.props.match.params.id;

        eventService
            .getEventTickets(eventId)
            .then(serverTickets => {
                let id = 1;
                serverTickets.map(ticket => (ticket.id = id++));

                this.initialTickets = JSON.parse(JSON.stringify(serverTickets));
                this.setState({ tickets: serverTickets });
            })
            .catch(error => console.error(error));
    }

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

    handleButtonSubmitClick = e => {
        e.preventDefault();
        let eventId = this.props.match.params.id;

        let oldTickets = this.initialTickets;
        let newTickets = this.state.tickets;

        let addList = newTickets.filter(ticket => ticket.id == null);

        let updateList = [];

        oldTickets.forEach(oldTicket => {
            newTickets.forEach(newTicket => {
                if (oldTicket.id == newTicket.id) {
                    if (
                        oldTicket.name != newTicket.name ||
                        oldTicket.price != newTicket.price ||
                        oldTicket.amount != newTicket.amount
                    ) {
                        newTicket.oldName = oldTicket.name;
                        updateList.push(newTicket);
                    }
                }
            });
        });

        let deleteList = [];

        oldTickets.forEach(oldTicket => {
            let shouldDelete = true;

            newTickets.forEach(newTicket => {
                if (oldTicket.id == newTicket.id) {
                    shouldDelete = false;
                }
            });

            if (shouldDelete) deleteList.push(oldTicket);
        });

        let promises = []; 

        addList.map(ticket => {
            let promise = eventService.createTicket(
                ticket.name,
                eventId,
                ticket.price,
                ticket.amount
            );

            promises.push(promise); 
        });

        updateList.map(ticket => {
            let promise = eventService.updateTicket(
                ticket.oldName,
                ticket.name,
                eventId,
                ticket.price,
                ticket.amount
            );

            promises.push(promise); 
        });

        deleteList.map(ticket => {
            let promise = eventService.deleteTicket(ticket.name, eventId);
            promises.push(promise); 
        });

        Promise.all(promises).then(history.push('/arrangement/' + eventId));
    };

    handleButtonDeleteClick = e => {
        e.preventDefault();

        let tickets = this.state.tickets;
        const id = e.target.parentNode.id;
        tickets.splice(id, 1);

        this.setState({ tickets: tickets });
    };

    handleChange = e => {
        const newTickets = [...this.state.tickets];

        const id = e.target.parentNode.id;

        newTickets[id][e.target.name] = e.target.value;

        this.setState({ tickets: newTickets });
    };

    render() {
        return (
            <TicketEdit
                tickets={this.state.tickets}
                addNewtickets={this.addNewtickets}
                handleButtonAddClick={this.handleButtonAddClick}
                handleButtonSubmitClick={this.handleButtonSubmitClick}
                handleButtonDeleteClick={this.handleButtonDeleteClick}
                handleChange={this.handleChange}
            />
        );
    }
}
