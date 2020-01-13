import React from 'react';

const ticketLine = props => {
    return (
        <>
            <select
                title="Billettype"
                onChange={props.changed}
                value={props.description}
                name="description"
            >
                <option>Velg billett</option>
                <option>Early Bird</option>
                <option>Student</option>
                <option>Junior</option>
                <option>Honnør</option>
                <option>VIP</option>
            </select>
            <input
                type="text"
                name="amount"
                onChange={props.changed}
                placeholder="Antall"
                value={props.amount}
            />
            <input
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
