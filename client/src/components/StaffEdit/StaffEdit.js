import React from 'react';

import classes from '../StaffEdit/StaffEdit.module.scss';

const staffEdit = props => {
    console.log(props); 

    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Rediger personell</h1>

            <div className={classes.desc__wrapper}>
                <p className={classes.ph__name}>Navn</p>
                <p className={classes.ph__contact}>Kontakt info</p>
                <p className={classes.ph__profession}>Yrke</p>
            </div>
            <form className={classes.form} onSubmit={props.handleButtonSubmitClick}>
                <div className={classes.staff__list}>
                    {props.staff.map((e, i) => (
                        <div className={classes.staff__wrapper} key={i} id={i}>
                            <input
                                className={classes.input__name}
                                type="text"
                                name="name"
                                value={e.name}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={classes.input__contactInfo}
                                type="text"
                                name="contactInfo"
                                value={e.contactInfo}
                                onChange={props.handleChange}
                                required
                            />

                            <input
                                className={classes.input__profession}
                                type="text"
                                name="proffesion"
                                value={e.profession}
                                onChange={props.handleChange}
                                required
                            />
                            <input
                                className={classes.button__delete}
                                onClick={props.handleButtonDeleteClick}
                                type="button"
                                value="slett"
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
                    value="Bekreft endringer"
                />
            </form>
        </div>
    );
};

export default staffEdit;
