import React from 'react';

import classes from '../TicketEdit/TicketEdit.module.scss';

/**
    Component for editing, adding and deleting tickets for an event
    Only the host of the event has access right
 */
const ticketEdit = props => {
    return (
        <div className={classes.container}>
            <input
                className={`${classes.button__back} ${'Button'}`}
                type="button"
                value="&larr; Tilbake"
                onClick={props.handleButtonBackClick}
            />
            <h1 className={classes.title}>Rediger billetter</h1>

            <div className={classes.desc__wrapper}>
                <p className={classes.ph__name}>Navn</p>
                <p className={classes.ph__price}>Pris</p>
                <p className={classes.ph__amount}>Antall</p>
            </div>
            <form
                className={classes.form}
                onSubmit={props.handleButtonSubmitClick}
            >
                <div className={classes.ticket__list}>
                    {props.tickets.map((e, i) => (
                        <div className={classes.ticket__wrapper} key={i} id={i}>
                            <input
                                className={`${classes.input__name} ${'Input'}`}
                                type="text"
                                name="name"
                                value={e.name}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={`${classes.input__price} ${'Input'}`}
                                type="number"
                                name="price"
                                value={e.price}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={`${
                                    classes.input__amount
                                } ${'Input'}`}
                                type="number"
                                name="amount"
                                value={e.amount}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={`${
                                    classes.button__delete
                                } ${'Button'}`}
                                onClick={props.handleButtonDeleteClick}
                                type="button"
                                value="-"
                            />
                        </div>
                    ))}
                </div>
                <input
                    className={`${classes.button__add} ${'Button'}`}
                    onClick={props.handleButtonAddClick}
                    type="button"
                    value="+"
                />
                <input
                    className={`${classes.button__submit} ${'Button'}`}
                    type="submit"
                    value="Lagre endringer"
                />
            </form>
        </div>
    );
};

export default ticketEdit;
