import React, { Component } from 'react';

import classes from './EventInfo.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UpdateFile from './../../containers/Upload/UpdateFile';
import PdfView from './../../components/PdfView/PdfViewPc';
import { eventService } from '../../services';
import Spinner from '../UI/Spinner/Spinner';
import Modal from './../UI/Modal/Modal';
import Map from '../Map/Map';

import {
    faUser,
    faFile,
    faLocationArrow,
    faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

//Component for displaying information about an event
export default class EventInfo extends Component {
    state = {
        newContract: false,
        showModal: false,
        url: 'TOM',
        callerID: null,
        noData: false
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal /* !prevState.showModal */,
            newContract: false
        }));
    };

    handleContractView = (performanceId, index) => {
        console.log(performanceId);
        this.setState({
            callerID: performanceId,
            showModal: true,
            url: 'TOM',
            noData: false
        });
        eventService
            .getContract(this.props.eventId, performanceId)
            .then(data => {
                if (!data) {
                    this.setState({ noData: true });
                } else {
                    this.setState({ url: data });
                }
            });
        this.handleToggleModal();
    };

    handleEditContract = () => {
        this.setState(prevState => ({
            newContract: !prevState.newContract
        }));
    };

    render() {
        return (
            <div className={classes.container}>
                <Modal
                    show={this.state.showModal}
                    clicked={this.handleToggleModal}
                >
                    {this.state.url !== 'TOM' && !this.state.newContract ? (
                        <PdfView url={this.state.url} />
                    ) : this.state.newContract ? null : this.state.noData ? (
                        <div className="MediumTitle">
                            Denne artisten har ingen kontrakt
                        </div>
                    ) : (
                        <Spinner />
                    )}
                    {this.state.newContract ? (
                        <UpdateFile
                            toggleModal={this.handleToggleModal}
                            eventId={this.props.eventId}
                            performanceId={this.state.callerID}
                        />
                    ) : null}
                    <div>
                        <button
                            className="Button Button--inverse"
                            onClick={this.handleEditContract}
                            style={{
                                visibility:
                                    this.props.artistToken === 1
                                        ? 'hidden'
                                        : 'visible'
                            }}
                        >
                            {this.state.newContract ? 'Tilbake' : 'Endre'}
                        </button>
                        <button
                            className="Button"
                            onClick={this.handleToggleModal}
                        >
                            Lukk
                        </button>
                    </div>
                </Modal>
                <div className={classes.top__section}>
                    <h1 className={classes.title}>{this.props.title}</h1>
                    <button
                        className={[classes.button__edit, 'Button'].join(' ')}
                        onClick={this.props.handleEditClick}
                        style={{
                            visibility:
                                this.props.artistToken === 1
                                    ? 'hidden'
                                    : 'visible'
                        }}
                    >
                        &#9986;&nbsp; Rediger
                    </button>
                </div>
                <div className={classes.desc}>
                    <h1 className={classes.descTitle}>Om arrangementet</h1>
                    {this.props.description
                        .split(/\r?\n/)
                        .map((paragraph, i) => (
                            <p key={i}>
                                {paragraph}
                                <br />
                            </p>
                        ))}
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
                            Fra: {this.props.dateFrom} <br /> Til:{' '}
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
                        style={{
                            visibility:
                                this.props.artistToken === 1
                                    ? 'hidden'
                                    : 'visible'
                        }}
                    >
                        Rediger
                    </button>

                    <div className={classes.artist__list}>
                        {this.props.artists.map((artist, i) => {
                            return (
                                <div
                                    className={classes.artist__wrapper}
                                    key={i}
                                >
                                    <div className={classes.artist__image}>
                                        <img
                                            src={artist.picture}
                                            alt={artist.username}
                                        ></img>
                                    </div>
                                    <h3>{artist.name}</h3>
                                    <button
                                        className={classes.button__contract}
                                        onClick={() => {
                                            this.handleContractView(
                                                artist.id,
                                                i
                                            );
                                            this.handleToggleModal();
                                        }}
                                        style={{
                                            visibility:
                                                this.props.artistToken === 0 ||
                                                (this.props.artistToken === 1 &&
                                                    artist.userId ===
                                                        parseInt(
                                                            sessionStorage.getItem(
                                                                'user'
                                                            )
                                                        ))
                                                    ? 'visible'
                                                    : 'hidden'
                                        }}
                                    >
                                        Kontrakt
                                    </button>
                                    <button
                                        className={classes.button__rider}
                                        onClick={event =>
                                            this.props.handleRiderClick(
                                                event,
                                                artist.id
                                            )
                                        }
                                        style={{
                                            visibility:
                                                this.props.artistToken === 0 ||
                                                (this.props.artistToken === 1 &&
                                                    artist.userId ===
                                                        parseInt(
                                                            sessionStorage.getItem(
                                                                'user'
                                                            )
                                                        ))
                                                    ? 'visible'
                                                    : 'hidden'
                                        }}
                                    >
                                        Rider
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={classes.tickets}>
                    <h1 className={classes.subtitle}>Billetter</h1>
                    <button
                        className={classes.ticket__button}
                        onClick={this.props.handleTicketEditClick}
                        style={{
                            visibility:
                                this.props.artistToken === 1
                                    ? 'hidden'
                                    : 'visible'
                        }}
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
                        style={{
                            visibility:
                                this.props.artistToken === 1
                                    ? 'hidden'
                                    : 'visible'
                        }}
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
