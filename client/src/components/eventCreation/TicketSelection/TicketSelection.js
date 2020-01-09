import React, { Component } from 'react';
import TicketLine from './TicketLine/TicketLine';

export default class TicketSelection extends Component {
  state = {
    tickets: this.props.tickets
  };

  handleNewTicket = () => {
        let tickets = [...this.state.tickets];
        tickets.push('');

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
      tickets[id] = event.target.value;

      this.setState({ tickets });
  };

    render() {
        return (
            <>
              <button onClick={this.handleNewTicket}>Legg til</button>
              <div>
                  <text> Billettype </text>
                  <text> Antall </text>
                  <text> Pris </text>
              </div>
                {this.state.tickets.map((el, i) => {
                    return (
                        <div key={i} id={i}>
                            <TicketLine 
                            onChange={this.handleChange} 
                            value={el}
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
                        this.props.saveTickets(this.state.tickets, 'next')
                    }
                >
                    Neste
                </button>
                <button
                    onClick={() =>
                        this.props.saveTickets(this.state.tickets, 'previous')
                    }
                >
                    Forrige
                </button>
            </>
        );
    }


}
