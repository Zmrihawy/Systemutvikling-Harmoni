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
            <div className={classes.staff__list}>
                {props.staff.map(e => (
                    <form className={classes.staff__wrapper}>
                        <input
                            className={classes.input__name}
                            type="text"
                            name="name"
                            value={e.name}
                            onChange={props.handleChange}
                        />
                        <input
                            className={classes.input__contactInfo}
                            type="text"
                            name="contact info"
                            value={e.contactInfo}
                            onChange={props.handleChange}
                        />

                        <input
                            className={classes.input__profession}
                            type="text"
                            name="proffesion"
                            value={e.profession}
                            onChange={props.handleChange}
                        />
                        <input
                            className={classes.button__delete}
                            type="submit"
                            value="slett"
                        />
                    </form>
                ))}
            </div>
            <input
                className={classes.button__submit}
                type="submit"
                value="Bekreft"
            />
        </div>
    );
};

export default staffEdit;
