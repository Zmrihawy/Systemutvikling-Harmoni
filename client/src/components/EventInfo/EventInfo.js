import React from 'react';

import classes from './EventInfo.module.scss';
import Map from '../Map/Map';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faFile,
    faLocationArrow,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

const eventInfo = props => {
    return (
        <div className={classes.container}>
            <div className={classes.top__section}>
                <h1 className={classes.title}>{props.title}</h1>
                <button className={classes.button__edit}>
                    Rediger arrangement
                </button>
            </div>
            <div className={classes.desc}>
                <h1 className={classes.descTitle}>Om arrangementet</h1>
                <p>{props.desc}</p>
            </div>

            <div className={classes.info}>
                <div className={`${classes.location} ${classes.info__item}`}>
                    <h2 className={classes.info__title}>Lokasjon</h2>
                    <p className={classes.info__description}>
                        {props.location}
                    </p>
                    <FontAwesomeIcon
                        className={classes.info__icon}
                        icon={faLocationArrow}
                    />
                </div>
                <div className={`${classes.date} ${classes.info__item}`}>
                    <h2 className={classes.info__title}>Dato</h2>
                    <p className={classes.info__description}>{props.date}</p>
                    <FontAwesomeIcon
                        className={classes.info__icon}
                        icon={faCalendarAlt}
                    />
                </div>
                <div className={`${classes.host} ${classes.info__item}`}>
                    <h2 className={classes.info__title}>Arrangør</h2>
                    <p className={classes.info__description}>{props.host}</p>
                    <FontAwesomeIcon
                        className={classes.info__icon}
                        icon={faUser}
                    />
                </div>
                <div
                    className={`${classes.ticketAmount} ${classes.info__item}`}
                >
                    <h2 className={classes.info__title}>Antall billetter</h2>
                    <p className={classes.info__description}>
                        {props.ticketAmount}
                    </p>
                    <FontAwesomeIcon
                        className={classes.info__icon}
                        icon={faFile}
                    />
                </div>
            </div>

            <div className={classes.map}>
                <Map
                    longitude={props.longitude}
                    latitude={props.latitude}
                    location={props.location}
                />
            </div>

            <div className={classes.artists}>
                <h1 className={classes.subtitle}>Artister</h1>

                <div className={classes.artist__list}>
                    {props.artists.map((artist, i) => (
                        <div className={classes.artist__wrapper} key={i}>
                            <div className={classes.artist__image}>
                                <img src={artist.image} alt={artist.name}></img>
                            </div>
                            <h3>{artist.name}</h3>
                            <button className={classes.button__contract}>
                                Kontrakt
                            </button>
                            <button className={classes.button__rider}>
                                Rider
                            </button>
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

            <div className={classes.staff}>
                <h1 className={classes.subtitle}>Personell</h1>

                <div className={classes.staff__list}>
                    {props.staff.map((staff, i) => (
                        <div className={classes.staff__wrapper} key={i}>
                            <h2 className={classes.staff__name}>
                                {staff.name}
                            </h2>
                            <p className={classes.staff_number}>
                                Mobil: {staff.number}
                            </p>
                            <p className={classes.staff_proffesion}>
                                {staff.proffesion}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default eventInfo;
