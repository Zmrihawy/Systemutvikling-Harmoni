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

    /* handleInputChange = event => {
        let inputValue = [...this.state.inputValue];
        event.target.name = event.target.value;

        this.setState({ inputValue });
    }; */

    render() {
        return (
            <>
                <button onClick={this.handleNewTicket}>
                    Legg til ny billett
                </button>

                <Modal
                    show={this.state.showModal}
                    closed={this.handleToggleModal}
                >
                    <input
                        type="text"
                        name="ticketInput"
                        onChange={this.handleChange}
                        value={this.state.ticketInput}
                        className="Input"
                        required
                    />
                    <button onClick={this.handleCustomTicketOption}>
                        Opprett ny billettype
                    </button>
                </Modal>
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
                <button onClick={this.handleToggleModal}>
                    Opprett billettype
                </button>
                <button
                    onClick={() =>
                        this.props.save(
                            [this.state.tickets, this.state.ticketOptions],
                            'tickets',
                            'previous'
                        )
                    }
                >
                    Forrige
                </button>
                <button
                    onClick={() =>
                        this.props.save(
                            [this.state.tickets, this.state.ticketOptions],
                            'tickets',
                            'next'
                        )
                    }
                >
                    Videre
                </button>
            </>
        );
    }
}
