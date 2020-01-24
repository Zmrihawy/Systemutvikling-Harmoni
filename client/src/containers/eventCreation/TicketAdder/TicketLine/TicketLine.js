import React from 'react';

const ticketLine = props => {
    return (
        <>
            <select
                className="Input"
                title="Billettype"
                onChange={props.changed}
                value={props.description}
                name="description"
            >
                <option value="" selected disabled hidden>
                    Billettype
                </option>
                {props.options.map((option, i) => {
                    const chosen = props.selectedTickets.includes(option);
                    return (
                        <option key={i} value={option} disabled={chosen}>
                            {option}
                        </option>
                    );
                })}
            </select>
            <input
                className="Input"
                type="number"
                min="0"
                name="amount"
                onChange={props.changed}
                placeholder="Antall"
                value={props.amount}
            />
            <input
                className="Input"
                type="number"
                min="0"
                name="price"
                onChange={props.changed}
                placeholder="Pris"
                value={props.price}
            />
        </>
    );
};

export default ticketLine;
