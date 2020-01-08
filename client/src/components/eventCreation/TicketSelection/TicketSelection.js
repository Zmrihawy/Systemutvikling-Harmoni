import React from 'react';
import TicketLine from './TicketLine';

const ticketSelection = props => {
  return (
    <div>
      <div>
        <text> Billettype </text>
        <text> Antall </text>
        <text> Pris </text>
      </div>
      <TicketLine ticketSelect={props.ticketSelect} value={props.tickets} />
      <button onClick={props.clicked}>Neste</button>
    </div>
  );
};

export default ticketSelection;
