import React, { Component } from 'react';
import classes from './EventOverview.module.scss';

const eventOverview = props => {
    return (
        <div className={classes.container}>
                <input
                    className={classes.input__search}
                    type="text"
                    name="search"
                    placeholder="Søk"
                    onChange={props.handleSearch}
                />

            <div className={classes.active__events}>
                <h1 className={`${classes.title__active} ${classes.title}`}>
                    Aktive arrangementer
                </h1>
                <div className={classes.event__list}>
                    {props.activeEvents.map(event => (
                        <div className={classes.article} key={event.id}>
                            <img
                                className={classes.image}
                                src={event.picture}
                            />

                            <div className={classes.text}>
                                <h3>{event.name}</h3>
                                <p>Sted: {event.location} </p>
                                <p>
                                    Dato:{' '}
                                    {new Date(event.startTime)
                                        .toUTCString()
                                        .slice(0, -7)}{' '}
                                </p>
                                <button
                                    onClick={() =>
                                        props.handleButtonClick(event.id)
                                    }
                                >
                                    Les mer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={classes.archived__events}>
                <h1 className={`${classes.title__archived} ${classes.title}`}>
                    Arkiverte arrangementer
                </h1>
                <div className={classes.event__list}>
                    {props.archivedEvents.map(event => (
                        <div className={classes.article} key={event.id}>
                            <img
                                className={classes.image}
                                src={event.picture}
                            />

                            <div className={classes.text}>
                                <h3>{event.name}</h3>
                                <p>Sted: {event.location} </p>
                                <p>
                                    Dato:{' '}
                                    {new Date(event.startTime)
                                        .toUTCString()
                                        .slice(0, -7)}{' '}
                                </p>
                                <button
                                    onClick={() =>
                                        props.handleButtonClick(event.id)
                                    }
                                >
                                    Les mer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default eventOverview;
