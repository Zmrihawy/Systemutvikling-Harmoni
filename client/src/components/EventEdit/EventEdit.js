import React from 'react';

import classes from '../EventEdit/EventEdit.module.scss';

const eventEdit = props => {
    console.log(props.event);
    return (
        <form className={classes.container} onSubmit={props.handleButtonClick}>
            <input className={classes.input__title} type="text" value={props.event.name} onChange={props.changed} />
            <input className={classes.input__title} type="text" value={props.event.description} onChange={props.changed} />
            <input className={classes.button__submit} type='submit' value='✓'/>
        </form>
    );
};

export default eventEdit;
