import React, { Component } from 'react';
import moment from 'moment';
import { history } from '../App';
import NewEventHandler from '../../NewEventHandler';
import Modal from '../../components/UI/Modal/Modal';
import BasicForm from '../../components/BasicForm/BasicForm';
import DatePicker from '../DatePicker/DatePicker';
import ArtistAdder from '../eventCreation/ArtistAdder/ArtistAdder';
import DescriptionAdder from '../../components/DescriptionAdder/DescriptionAdder';
import LocationAdder from '../../containers/eventCreation/LocationAdder/LocationAdder';
import StaffAdder from '../eventCreation/StaffAdder/StaffAdder';
import TicketAdder from '../eventCreation/TicketAdder/TicketAdder';
import RiderAdder from '../eventCreation/RiderAdder/RiderAdder';
import ContractAdder from '../../containers/eventCreation/ContractAdder/ContractAdder';
import pdfReader from '../../components/PdfView/PdfViewPc';
import CreateEventSummary from './CreateEventSummary/CreateEventSummary';
import NoArtists from '../../components/NoArtists/NoArtists';
import Type from '../../components/UI/Type/Type';
import manWithFiles from '../../assets/images/manWithFiles.svg';
import engineer from '../../assets/images/engineer.svg';
import PdfReader from '../../components/PdfView/PdfViewPc';

import classes from './CreateEvent.module.scss';

export default class CreateEvent extends Component {
    state = {
        showBackdrop: false,
        currentPage: 3,
        newEvent: {
            title: '',
            description: '',
            location: 'Trondheim',
            longitude: 10.3951,
            latitude: 63.4305,
            times: [
                moment().format('YYYY-MM-DD hh:mm:ss'),
                moment().format('YYYY-MM-DD hh:mm:ss')
            ],
            artists: [],
            contracts: null,
            tickets: [],
            staff: []
        },
        ticketOptions: [
            'Early Bird',
            'Junior',
            'Student',
            'Voksen',
            'Honnør',
            'VIP'
        ],
        artistOptions: []
    };

    handleToggleBackdrop = () => {
        this.state.showBackdrop
            ? this.setState({ showBackdrop: false })
            : this.setState({ showBackdrop: true });
    };

    handleChange = event => {
        const newEvent = {
            ...this.state.newEvent,
            [event.target.name]: event.target.value
        };
        this.setState({ newEvent });
    };

    handleDateChange = date => {
        let newEvent = {
            ...this.state.newEvent
        };
        newEvent.dateRange = date;
        this.setState({ newEvent });
    };

    handleTimeChange = (value, id) => {
        let newEvent = this.state.newEvent;

        if (id === 'timeFrom') {
            newEvent.timeRange[0] = value;
        } else if (id === 'timeTo') {
            newEvent.timeRange[1] = value;
        }

        this.setState({ newEvent });
    };

    handleNext = event => {
        if (event) {
            event.preventDefault();
        }
        let page = this.state.currentPage;
        this.setState({ currentPage: ++page });
    };

    handlePrevious = event => {
        if (event) {
            event.preventDefault();
        }
        let page = this.state.currentPage;
        this.setState({ currentPage: --page });
    };

    handleNewEvent = async () => {
        const newEvent = {
            ...this.state.newEvent
        };

        // Lagre det nye eventet vha. NewEventHandler
        const eventStatus = await NewEventHandler.handleNewEvent(newEvent);

        if (eventStatus) {
            // Arrangement registrert
            history.push('/arrangement');
        } else {
            // Arrangement ikke registrert
            alert('Arrangementet ble IKKE registrert :(');
        }
    };

    handleSaveStaff = input => {
        this.handleSave(input, 'staff', '');
        this.handleToggleBackdrop();
    };

    handleMapClick = (map, e) => {
        let longitude = e.lngLat.lng;
        let latitude = e.lngLat.lat;

        let newEvent = {
            ...this.state.newEvent
        };

        newEvent.latitude = latitude;
        newEvent.longitude = longitude;

        this.setState({ newEvent });
    };

    handleSave = (input, select, action) => {
        let result;
        // Remove empty elements from the array
        if (select === 'artists') {
            this.setState({ artistOptions: input[1] });

            result = input[0].filter(el => el.name.trim() !== '');
        } else if (select === 'staff') {
            result = input.filter(
                el => el.name.trim() !== '' && el.profession.trim() !== ''
            );
        } else if (select === 'tickets') {
            this.setState({ ticketOptions: input[1] });

            result = input[0].filter(el => el.amount !== '' && el.price !== '');
        } else if (select === 'riders') {
            input.forEach(el => {
                el.riders = el.riders.filter(element => {
                    return element.description !== '';
                });
            });
            select = 'artists';
            result = [...input];
        } else if (select === 'times') {
            result = [...input];
        } else if (select === 'contracts') {
            console.log(input);
            result = [...input];
        }

        const newEvent = {
            ...this.state.newEvent
        };
        newEvent[select] = result;

        this.setState({ newEvent });

        if (action === 'next') {
            this.handleNext();
        } else if (action === 'previous') {
            this.handlePrevious();
        }
    };

    getCurrentPage = () => {
        let current;

        switch (this.state.currentPage) {
            case 0:
                current = (
                    <>
                        <BasicForm
                            key={this.state.currentPage}
                            title="Hva skal arrangementet hete?"
                            inputType="text"
                            value={this.state.newEvent.title}
                            name="title"
                            next={this.handleNext}
                            changed={this.handleChange}
                        />
                    </>
                );
                break;

            case 1:
                current = (
                    <>
                        <DescriptionAdder
                            title="Hva skal beskrivelsen være?"
                            value={this.state.newEvent.description}
                            name="description"
                            next={this.handleNext}
                            previous={this.handlePrevious}
                            changed={this.handleChange}
                        />
                    </>
                );
                break;

            case 2:
                current = (
                    <>
                        <LocationAdder
                            title="Hvor skal arrangementet være?"
                            inputType="text"
                            value={this.state.newEvent.location}
                            next={this.handleNext}
                            previous={this.handlePrevious}
                            changed={this.handleChange}
                            longitude={this.state.newEvent.longitude}
                            latitude={this.state.newEvent.latitude}
                            mapClicked={this.handleMapClick}
                            last
                        />
                    </>
                );
                break;

            case 3:
                current = (
                    <DatePicker
                        save={this.handleSave}
                        timeFrom={this.state.newEvent.times[0]}
                        timeTo={this.state.newEvent.times[1]}
                    />
                );
                break;

            case 4:
                current = (
                    <ArtistAdder
                        artists={this.state.newEvent.artists}
                        artistOptions={this.state.artistOptions}
                        save={this.handleSave}
                    />
                );
                break;
            case 5:
                if (this.state.newEvent.artists.length > 0) {
                    current = (
                        <RiderAdder
                            artists={this.state.newEvent.artists}
                            save={this.handleSave}
                        />
                    );
                } else {
                    current = (
                        <NoArtists
                            next={this.handleNext}
                            previous={this.handlePrevious}
                            title="Riders"
                        />
                    );
                }
                break;

            case 6:
                if (this.state.newEvent.artists.length > 0) {
                    current = (
                        <ContractAdder
                            artists={this.state.newEvent.artists}
                            contracts={this.state.newEvent.contracts}
                            save={this.handleSave}
                        />
                    );
                } else {
                    current = (
                        <NoArtists
                            next={this.handleNext}
                            previous={this.handlePrevious}
                            title="Kontrakter"
                        />
                    );
                }

                break;

            case 7:
                current = (
                    <TicketAdder
                        tickets={this.state.newEvent.tickets}
                        save={this.handleSave}
                        ticketOptions={this.state.ticketOptions}
                    />
                );
                break;

            case 8:
                current = (
                    <>
                        <Modal
                            show={this.state.showBackdrop}
                            closed={this.handleToggleBackdrop}
                        >
                            <div className="MediumTitle">
                                Vil du opprette arrangementet?
                            </div>
                            <CreateEventSummary event={this.state.newEvent} />
                            <div>
                                <button
                                    className="Button Button--inverse"
                                    onClick={this.handleNewEvent}
                                >
                                    Ja
                                </button>
                                <button
                                    className="Button"
                                    onClick={this.handleToggleBackdrop}
                                >
                                    Nei
                                </button>
                            </div>
                        </Modal>
                        <div className="MediumTitle">
                            <Type
                                strings="Skal arrangementet ha personell?"
                                loop={false}
                                speed={35}
                            />
                        </div>
                        <StaffAdder
                            staff={this.state.newEvent.staff}
                            finished={this.handleSaveStaff}
                            save={this.handleSave}
                        />
                    </>
                );
                break;

            default:
                current = <div>ERROR 404</div>;
        }
        return current;
    };

    render() {
        let current = this.getCurrentPage();
        let image;
        const currentPage = this.state.currentPage;
        currentPage < 8 ? (image = manWithFiles) : (image = engineer);
        if (currentPage === 2) image = null;

        return (
            <>
                <div className={classes.CreateEvent__container}></div>
                {image ? (
                    <img
                        className={classes.CreateEvent__image}
                        src={image}
                        alt="Filler Image"
                    />
                ) : null}
                <div className={classes.CreateEvent}>{current}</div>
            </>
        );
    }
}
