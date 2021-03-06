import React from 'react';

import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.scss';

// This is a component that serves as a pop up box
const modal = props => {
    return (
        <>
            <Backdrop show={props.show} clicked={props.closed} />
            <div
                className={classes.Modal}
                style={{
                    transform: props.show
                        ? 'translateY(0)'
                        : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0'
                }}
            >
                {props.children}
            </div>
        </>
    );
};

export default modal;
