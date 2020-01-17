import React, { Component } from 'react';
import TicketLine from './TicketLine/TicketLine';

export default class TicketAdder extends Component {
    state = {
        tickets: this.props.tickets
    };

    handleNewTicket = () => {
        let tickets = [...this.state.tickets];
        tickets.push({ description: 'Velg billett', amount: '', price: '' });

        this.setState({ tickets });
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
                <button
                    className="Button Button--add"
                    onClick={this.handleNewTicket}
                >
                    Legg til
                </button>
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
                <div>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                this.state.tickets,
                                'tickets',
                                'previous'
                            )
                        }
                    >
                        &larr; Tilbake
                    </button>
                    <button
                        className="Button"
                        onClick={() =>
                            this.props.save(
                                this.state.tickets,
                                'tickets',
                                'next'
                            )
                        }
                    >
                        Neste &rarr;
                    </button>
                </div>
            </>
        );
    }
}
