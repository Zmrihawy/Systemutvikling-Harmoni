import React, { Component } from 'react';

import classes from './EventInfo.module.scss';
import Map from '../Map/Map';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faFile,
    faLocationArrow,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

import Modal from './../UI/Modal/Modal';
//import UpdateFile from './../../containers/Upload/UpdateFile';

export default class EventInfo extends Component {
    state = {
        showModal: false
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    handleContractView = () => {
        this.handleToggleModal();
    };

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.top__section}>
                    <h1 className={classes.title}>{this.props.title}</h1>
                    <button
                        className={classes.button__edit}
                        onClick={this.props.handleEditClick}
                    >
                        Rediger arrangement
                    </button>
                </div>
                <div className={classes.desc}>
                    <h1 className={classes.descTitle}>Om arrangementet</h1>
                    <p>{this.props.description}</p>
                </div>

                <div className={classes.info}>
                    <div
                        className={`${classes.location} ${classes.info__item}`}
                    >
                        <h2 className={classes.info__title}>Lokasjon</h2>
                        <p className={classes.info__description}>
                            {this.props.location}
                        </p>
                        <FontAwesomeIcon
                            className={classes.info__icon}
                            icon={faLocationArrow}
                        />
                    </div>
                    <div className={`${classes.date} ${classes.info__item}`}>
                        <h2 className={classes.info__title}>Dato</h2>
                        <p className={classes.info__description}>
                            {' '}
                            Til: {this.props.dateFrom} <br /> Fra:{' '}
                            {this.props.dateTo}
                        </p>
                        <FontAwesomeIcon
                            className={classes.info__icon}
                            icon={faCalendarAlt}
                        />
                    </div>
                    <div className={`${classes.host} ${classes.info__item}`}>
                        <h2 className={classes.info__title}>Arrangør</h2>
                        <p className={classes.info__description}>
                            {this.props.host}
                        </p>
                        <FontAwesomeIcon
                            className={classes.info__icon}
                            icon={faUser}
                        />
                    </div>
                    <div
                        className={`${classes.ticketAmount} ${classes.info__item}`}
                    >
                        <h2 className={classes.info__title}>
                            Antall billetter
                        </h2>
                        <p className={classes.info__description}>
                            {this.props.ticketAmount}
                        </p>
                        <FontAwesomeIcon
                            className={classes.info__icon}
                            icon={faFile}
                        />
                    </div>
                </div>

                <div className={classes.map}>
                    <Map
                        longitude={this.props.longitude}
                        latitude={this.props.latitude}
                        location={this.props.location}
                        handleMapClick={this.props.handleMapClick}
                    />
                </div>

                <div className={classes.artists}>
                    <h1 className={classes.subtitle}>Artister</h1>
                    <button
                        className={classes.artist__button}
                        onClick={this.props.handleArtistEditClick}
                    >
                        Rediger
                    </button>

                    <div className={classes.artist__list}>
                        {this.props.artists.map((artist, i) => (
                            <div className={classes.artist__wrapper} key={i}>
                                <div className={classes.artist__image}>
                                    <img
                                        src={artist.picture}
                                        alt={artist.username}
                                    ></img>
                                </div>
                                <h3>{artist.name}</h3>
                                <button
                                    className={classes.button__contract}
                                    onClick={this.handleContractView}
                                >
                                    Kontrakt
                                </button>
                                <Modal
                                    show={this.state.showModal}
                                    closed={this.handleToggleModal}
                                >
                                    TEST, Kontrakt her
                                    <button onClick={this.handleToggleModal}>
                                        {' '}
                                        LUKK{' '}
                                    </button>
                                </Modal>
                                <button
                                    className={classes.button__rider}
                                    onClick={event =>
                                        this.props.handleRiderClick(
                                            event,
                                            artist.id
                                        )
                                    }
                                >
                                    Rider
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={classes.tickets}>
                    <h1 className={classes.subtitle}>Billetter</h1>
                    <button
                        className={classes.ticket__button}
                        onClick={this.props.handleTicketEditClick}
                    >
                        Rediger
                    </button>

                    <div className={classes.ticket__list}>
                        {this.props.tickets.map((ticket, i) => (
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
                    <button
                        className={classes.staff__button}
                        onClick={this.props.handleStaffEditClick}
                    >
                        Rediger
                    </button>

                    <div className={classes.staff__list}>
                        {this.props.staff.map((staff, i) => (
                            <div className={classes.staff__wrapper} key={i}>
                                <h2 className={classes.staff__name}>
                                    {staff.name}
                                </h2>
                                <p className={classes.staff_proffesion}>
                                    {staff.profession}
                                </p>
                                <p className={classes.staff_number}>
                                    Kontakt: {staff.number}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
