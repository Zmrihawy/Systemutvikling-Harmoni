import React, { Component } from 'react';
import TicketLine from './TicketLine/TicketLine';
import Modal from '../../../components/UI/Modal/Modal';
import Type from '../../../components/UI/Type/Type';

import classes from './TicketAdder.module.scss';

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
                <div className="MediumTitle">
                    <Type
                        strings="Hvilke billettyper ønsker du?"
                        loop={false}
                        speed={50}
                    />
                </div>
                <button
                    className="Button Button--add"
                    onClick={this.handleNewTicket}
                >
                    Legg til billetter
                </button>

                <Modal
                    show={this.state.showModal}
                    closed={this.handleToggleModal}
                >
                    <div className="MediumTitle">Ny billettype</div>
                    <input
                        type="text"
                        name="ticketInput"
                        onChange={this.handleChange}
                        value={this.state.ticketInput}
                        className="Input"
                        style={{ marginTop: '1rem' }}
                        required
                    />
                    <button
                        className="Button Button--add"
                        onClick={this.handleCustomTicketOption}
                    >
                        Opprett
                    </button>
                </Modal>
                <div className="Adder">
                    {this.state.tickets.map((el, i) => {
                        return (
                            <div key={i} id={i} style={{ direction: 'ltr' }}>
                                <TicketLine
                                    changed={this.handleChange}
                                    description={el.description}
                                    amount={el.amount}
                                    price={el.price}
                                    options={this.state.ticketOptions}
                                />
                                <span
                                    onClick={this.handleDeleteTickets}
                                    className="Deleter"
                                >
                                    &#10005;
                                </span>
                            </div>
                        );
                    })}
                </div>
                <button
                    className="Button Button--add"
                    style={{ marginTop: '2rem', fontSize: '1.4rem' }}
                    onClick={this.handleToggleModal}
                >
                    Ny billettype
                </button>
                <div>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                [this.state.tickets, this.state.ticketOptions],
                                'tickets',
                                'previous'
                            )
                        }
                    >
                        &larr; Forrige
                    </button>
                    <button
                        autoFocus
                        className="Button"
                        onClick={() =>
                            this.props.save(
                                [this.state.tickets, this.state.ticketOptions],
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
