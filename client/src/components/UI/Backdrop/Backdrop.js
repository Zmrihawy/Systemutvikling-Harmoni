import React from 'react';

import classes from './Backdrop.module.scss';

// This is a component userd in conjunction with the Modal component in order to create an popup box.
const backdrop = props => {
    return props.show ? (
        <div onClick={props.clicked} className={classes.Backdrop}></div>
    ) : null;
};

export default backdrop;
