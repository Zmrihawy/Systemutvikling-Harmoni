import React from 'react';

import classes from './CreateEventSummary.module.scss';

const createEventSummary = props => {
    return (
        <div className={classes.CreateEventSummary}>
            <div id="0">
                <p>Navn:</p>
                <p>Sted:</p>
                <p>Artister:</p>
                <p>Billettyper:</p>
                <p>Personell:</p>
            </div>
            <div id="1" style={{ textAlign: 'end' }}>
                <div>{props.event.title}</div>
                <div>{props.event.location}</div>
                <div>{props.event.artists.length}</div>
                <div>{props.event.tickets.length}</div>
                <div>{props.event.staff.length}</div>
            </div>
        </div>
    );
};

export default createEventSummary;
