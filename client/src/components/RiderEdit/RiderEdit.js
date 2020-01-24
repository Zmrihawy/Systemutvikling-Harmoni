import React from 'react';

import classes from '../RiderEdit/RiderEdit.module.scss';

/**
    Component for editing, adding and deleting riders for an artist 
    Only the host of the event or the artist himself has access right
 */
const riderEdit = props => {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Rediger rider for {props.name}</h1>

            <div className={classes.desc__wrapper}>
                <p className={classes.ph__desc}>Beskrivelse</p>
                <p className={classes.ph__amount}>Mengde</p>
                <p className={classes.ph__status}>Status</p>
            </div>
            <form
                className={classes.form}
                onSubmit={props.handleButtonSubmitClick}
            >
                <div className={classes.rider__list}>
                    {props.riders.map((e, i) => (
                        <div className={classes.rider__wrapper} key={i} id={i}>
                            <input
                                className={`${classes.input__name} ${'Input'}`}
                                type="text"
                                name="name"
                                value={e.name}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={`${classes.input__amount} ${'Input'}`}
                                type="number"
                                name="amount"
                                value={e.amount}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={classes.input__confirmed}
                                type="checkbox"
                                name="confirmed"
                                value={e.confirmed}
                                checked={e.confirmed}
                                onChange={props.handleChange}
                                disabled={props.artistToken === 1}
                            />
                            <input
                                className={`${classes.button__delete} ${'Button'}`}
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

export default riderEdit;
