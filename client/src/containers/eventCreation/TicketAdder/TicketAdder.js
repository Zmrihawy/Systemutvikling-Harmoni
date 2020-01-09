import React, { Component } from 'react';
import TicketLine from './TicketLine/TicketLine';

export default class TicketAdder extends Component {
    state = {
        tickets: this.props.tickets
    };

    handleNewTicket = () => {
        let tickets = [...this.state.tickets];
        tickets.push({ description: 'Velg billett', amount: 0, price: 0 });

        this.setState({ tickets });

        console.log(tickets);
    };

    handleDeleteTickets = event => {
        let tickets = [...this.state.tickets];
        tickets.splice(event.target.parentNode.id, 1);

        this.setState({ tickets });
    };

    handleChange = event => {
        let tickets = [...this.state.tickets];
        const id = event.target.parentNode.id;
        tickets[id][event.target.name] = event.target.value;

        this.setState({ tickets });
    };

    render() {
        return (
            <>
                <button onClick={this.handleNewTicket}>Legg til</button>
                <div>
                    <p> Billettype Antall Pris </p>
                </div>
                {this.state.tickets.map((el, i) => {
                    return (
                        <div key={i} id={i}>
                            <TicketLine
                                changed={this.handleChange}
                                description={el.description}
                                amount={el.amount}
                                price={el.price}
                            />
                            <span
                                onClick={this.handleDeleteTickets}
                                style={{ cursor: 'pointer' }}
                            >
                                &#10005;
                            </span>
                        </div>
                    );
                })}
                <button
                    onClick={() =>
                        this.props.save(
                            this.state.tickets,
                            'tickets',
                            'previous'
                        )
                    }
                >
                    Forrige
                </button>
                <button
                    onClick={() =>
                        this.props.save(this.state.tickets, 'tickets', 'next')
                    }
                >
                    Neste
                </button>
            </>
        );
    }
}
