import React, { Component } from 'react';
import classes from './EventOverview.module.scss';

const eventOverview = props => {
    return (
        <div className={classes.container}>
                <form className={classes.search__container} onChange={props.handleSearch}>
                <input
                    className={classes.input__search}
                    type="text"
                    name="search"
                    placeholder="Søk"
                />

                <input
                    className={classes.input__button}
                    type="submit"
                    value="Søk"
                />
</form>
            <div className={classes.active__events}>
                <h1 className={`${classes.title__active} ${classes.title}`}>
                    Aktive arrangementer
                </h1>
                <div className={classes.event__list}>
                    {props.activeEvents.map(event => (
                        <div className={classes.article} key={event.id}>
                            <img
                                className={classes.image}
                                src="http://media.istockphoto.com/photos/rock-concert-picture-id528906123?k=6&m=528906123&s=612x612&w=0&h=Ed3gQr4QmeJDUVJMKsQMS8tCz06iYPZwcwnRM9FX_HY="
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
                                src="http://media.istockphoto.com/photos/rock-concert-picture-id528906123?k=6&m=528906123&s=612x612&w=0&h=Ed3gQr4QmeJDUVJMKsQMS8tCz06iYPZwcwnRM9FX_HY="
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
