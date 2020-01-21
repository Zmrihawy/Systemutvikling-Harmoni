import React, { Component } from 'react';
import NewEventHandler from '../../NewEventHandler';
import moment from 'moment';
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
import Type from '../../components/UI/Type/Type';

import classes from './CreateEvent.module.scss';

import manWithFiles from '../../assets/images/manWithFiles.svg';
import engineer from '../../assets/images/engineer.svg';

export default class CreateEvent extends Component {
    state = {
        showBackdrop: false,
        currentPage: 0,
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
        ]
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

    handleNewEvent = () => {
        const newEvent = {
            ...this.state.newEvent
        };
        NewEventHandler.handleNewEvent(newEvent);
    };

    handleSaveStaff = input => {
        console.log('staffd');
        this.handleSave(input, 'staff', '');
        this.handleToggleBackdrop();
    };

    handleMapClick = (map, e) => {
        console.log('Map clicked');
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
            result = input.filter(el => el.name.trim() !== '');
        } else if (select === 'staff') {
            result = input.filter(
                el =>
                    el.name.trim() !== '' &&
                    el.profession.trim() !== '' &&
                    el.contact.trim() !== ''
            );
        } else if (select === 'tickets') {
            this.setState({ ticketOptions: input[1] });

            result = input[0];
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
                //<pdfReader url={'TEST URL'} />
                break;

            case 1:
                current = (
                    <>
                        <DescriptionAdder
                            title="Hva skal beskrivelsen av arrangementet være?"
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
                            key={this.state.currentPage}
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
                        <>
                            <div className="MediumTitle">Riders</div>
                            <p>
                                Ingen artister har blitt lagt til, gå{' '}
                                <span style={{ color: '#8499f0' }}>
                                    tilbake
                                </span>
                                &nbsp;for å endre.
                            </p>
                            <div>
                                <button
                                    className="Button Button--inverse"
                                    onClick={this.handlePrevious}
                                >
                                    &larr; Tilbake
                                </button>
                                <button
                                    className="Button"
                                    onClick={this.handleNext}
                                >
                                    Neste &rarr;
                                </button>
                            </div>
                        </>
                    );
                }
                break;

            case 6:
                if (this.state.newEvent.artists.length > 0) {
                    current = (
                        <div className="FileUpload">
                            <div className="Card">
                                <ContractAdder
                                    artists={this.state.newEvent.artists}
                                    save={this.handleSave}
                                />
                            </div>
                        </div>
                    );
                } else {
                    current = (
                        <>
                            <p>
                                Ingen artister har blitt lagt til, gå tilbake
                                for å endre.
                            </p>
                            <button onClick={this.handlePrevious}>
                                Forrige
                            </button>
                            <button onClick={this.handleNext}>Videre</button>
                        </>
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
                                Vil du opprette følgende arrangement?
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
                                speed={50}
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
