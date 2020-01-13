import React from 'react';

const ticketLine = props => {
  return (
    <div>
      <select
        title="Billettype"
        onChange={props.ticketSelect}
        // value={props.value}
        class="ticketSelect"
        name="description"
      >
        <option>Velg billett</option>
        <option /*value={props.value}*/> valg </option>
      </select>
      <input type="text" name="amount" onChange={props.ticketSelect} />
      <input type="text" name="price" onChange={props.ticketSelect} />
    </div>
  );
};

export default ticketLine;
