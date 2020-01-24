import React from 'react';

import classes from '../StaffEdit/StaffEdit.module.scss';

/**
    Component for editing, adding and deleting staff for an event
    Only the host of the event has access rights 
 */
const staffEdit = props => {
    return (
        <div className={classes.container}>
            <input
                className={`${classes.button__back} ${'Button'}`}
                type="button"
                value="Gå tilbake"
                onClick={props.handleButtonBackClick}
            />
            <h1 className={classes.title}>Rediger personell</h1>

            <div className={classes.desc__wrapper}>
                <p className={classes.ph__name}>Navn</p>
                <p className={classes.ph__profession}>Yrke</p>
                <p className={classes.ph__contact}>Kontakt info</p>
            </div>
            <form
                className={classes.form}
                onSubmit={props.handleButtonSubmitClick}
            >
                <div className={classes.staff__list}>
                    {props.staff.map((e, i) => (
                        <div className={classes.staff__wrapper} key={i} id={i}>
                            <input
                                className={`${classes.input__name} ${'Input'}`}
                                type="text"
                                name="name"
                                value={e.name}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={`${
                                    classes.input__proffesion
                                } ${'Input'}`}
                                type="text"
                                name="profession"
                                value={e.profession}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={`${
                                    classes.input__contactInfo
                                } ${'Input'}`}
                                type="text"
                                name="contactInfo"
                                value={e.contactInfo}
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

export default staffEdit;
