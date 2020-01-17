import React, { Component } from 'react';
import TicketLine from './TicketLine/TicketLine';
import Modal from '../../../components/UI/Modal/Modal';

export default class TicketAdder extends Component {
    state = {
        tickets: this.props.tickets,
        ticketOptions: this.props.ticketOptions,
        ticketInput: '',
        showModal: false
    };

    handleNewTicket = () => {
        let tickets = [...this.state.tickets];
        tickets.push({ description: 'Velg billett', amount: '', price: '' });

        this.setState({ tickets });
    };

    handleCustomTicketOption = () => {
        let ticketOptions = [...this.state.ticketOptions];
        ticketOptions.push(this.state.ticketInput);

        this.setState({ ticketOptions, ticketInput: '' });
        this.handleToggleModal();
    };

    handleDeleteTickets = event => {
        let tickets = [...this.state.tickets];
        tickets.splice(event.target.parentNode.id, 1);

        this.setState({ tickets });
    };

    handleChange = event => {
        if (event.target.name === 'ticketInput') {
            let ticketInput = event.target.value;
            this.setState({ ticketInput });
        } else {
            let tickets = [...this.state.tickets];
            const id = event.target.parentNode.id;
            tickets[id][event.target.name] = event.target.value;

            this.setState({ tickets });
        }
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
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
                                options={this.state.ticketOptions}
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
