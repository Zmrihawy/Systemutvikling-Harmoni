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
                {props.options.map((option, i) => {
                    return (
                        <option key={i} value={option}>
                            {option}
                        </option>
                    );
                })}
            </select>
            <input
                className="Input"
                type="text"
                name="amount"
                onChange={props.changed}
                placeholder="Antall"
                value={props.amount}
            />
            <input
                className="Input"
                type="text"
                name="price"
                onChange={props.changed}
                placeholder="Pris"
                value={props.price}
            />
        </>
    );
};

export default ticketLine;
