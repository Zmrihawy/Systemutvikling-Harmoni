import React from 'react';

import classes from '../RiderEdit/RiderEdit.module.scss';

const riderEdit = props => {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Rediger rider for {props.name}</h1>

            <div className={classes.desc__wrapper}>
                <p className={classes.ph__desc}>Beskrivelse</p>
                <p className={classes.ph__amount}>Mengde</p>
                <p className={classes.ph__status}>Status</p>
            </div>
            <form className={classes.form} onSubmit={props.handleButtonSubmitClick}>
                <div className={classes.rider__list}>
                    {props.riders.map((e, i) => (
                        <div className={classes.rider__wrapper} key={i} id={i}>
                            <input
                                className={classes.input__name}
                                type="text"
                                name="name"
                                value={e.name}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={classes.input__amount}
                                type="text"
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
                            />
                            <input
                                className={classes.button__delete}
                                onClick={props.handleButtonDeleteClick}
                                type="button"
                                value="-"
                            />
                        </div>
                    ))}
                </div>
                <input
                    className={classes.button__add}
                    onClick={props.handleButtonAddClick}
                    type="button"
                    value="+"
                />
                <input
                    className={classes.button__submit}
                    type="submit"
                    value="Lagre endringer"
                />
            </form>
        </div>
    );
};

export default riderEdit;