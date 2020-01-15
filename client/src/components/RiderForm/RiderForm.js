import React from 'react';

import classes from '../RiderInfo/RiderInfo.module.scss';

const riderForm = props => {
    return (
        <form className={classes.rider__wrapper} onSubmit={props.clicked}>
            <input className={classes.input__amount} type={props.inputType} value={props.value} name={props.name} onChange={props.changed} />
            <input className={classes.input__name} type={props.inputType} value={props.value} name={props.name} onChange={props.changed} />
            <input className={classes.button__add} type='submit' value='✓'/>
        </form>
    );
};

export default riderForm;
