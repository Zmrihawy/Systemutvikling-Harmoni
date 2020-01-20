import React from 'react';

import classes from './CreateEventSummary.module.scss';

const createEventSummary = props => {
    return (
        <div className={classes.CreateEventSummary}>
            <div id="0">
                <p>Navn:</p>
                <p>Beskrivelse:</p>
                <p>Sted:</p>
            </div>
            <div id="1" style={{ textAlign: 'end' }}>
                <div>{props.event.title}</div>
                <div>{props.event.description}</div>
                <div>{props.event.location}</div>
            </div>
        </div>
    );
};

export default createEventSummary;
