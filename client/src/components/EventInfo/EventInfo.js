import React from 'react';

import classes from './EventInfo.module.scss';

const eventInfo = props => {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>{props.title}</h1>
            <div className={classes.desc}>
                <h1 className={classes.descTitle}>Om arrangementet</h1>
                <p>{props.desc}</p>
            </div>

            <div className={classes.info}>
                <div className={classes.location}>
                    <h2>Lokasjon</h2>
                    <p>{props.location}</p>
                </div>
                <div className={classes.host}>
                    <h2>Arrangør</h2>
                    <p>{props.host}</p>
                </div>
                <div className={classes.ticketAmount}>
                    <h2>Antall billetter</h2>
                    <p>{props.ticketAmount}</p>
                </div>
            </div>

            <div className={classes.map}></div>

            <div className={classes.artists}>
                <h1 className={classes.subtitle}>Artister</h1>

                <div className={classes.artist__list}>
                    {props.artists.map((artist, i) => (
                        <div className={classes.artist__wrapper} key={i}>
                            <div className={classes.artist__image}>
                                <img src={artist.image}></img>
                            </div>
                            <h3>{artist.name}</h3>
                            <button className={classes.button__rider}>Rider</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={classes.tickets}>
                <h1 className={classes.subtitle}>Billetter</h1>

                <div className={classes.ticket__list}>
                    {props.tickets.map((ticket, i) => (
                        <div className={classes.ticket__wrapper} key={i}>
                                <h2>{ticket.description}</h2>
                                <p>Antall: {ticket.amount}</p>
                                <p>Pris: {ticket.price},-</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default eventInfo;
