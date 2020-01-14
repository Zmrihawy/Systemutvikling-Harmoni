import React, { Component } from 'react';
import moment from 'moment';
import Modal from '../../components/UI/Modal/Modal';
import BasicForm from '../../components/BasicForm/BasicForm';
import DatePicker from '../DatePicker/DatePicker';
import ArtistAdder from '../eventCreation/ArtistAdder/ArtistAdder';
import StaffAdder from '../eventCreation/StaffAdder/StaffAdder';
import TicketAdder from '../eventCreation/TicketAdder/TicketAdder';
import RiderAdder from '../eventCreation/RiderAdder/RiderAdder';

import classes from './CreateEvent.module.scss';

export default class CreateEvent extends Component {
    state = {
        showBackdrop: false,
        currentPage: 0,
        newEvent: {
            title: '',
            category: '',
            location: '',
            times: [
                moment().format('YYYY-MM-DD hh:mm:ss'),
                moment().format('YYYY-MM-DD hh:mm:ss')
            ],
            artists: [],
            tickets: [],
            staff: []
        }
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
        alert('Arrangement opprettet :)');
    };

    handleSaveStaff = input => {
        this.handleSave(input, 'staff', '');
        this.handleToggleBackdrop();
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
            result = input;
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
                    <BasicForm
                        title="Hva skal arrangementet hete?"
                        inputType="text"
                        value={this.state.newEvent.title}
                        name="title"
                        next={this.handleNext}
                        changed={this.handleChange}
                    />
                );
                break;

            case 1:
                current = (
                    <>
                        <BasicForm
                            title="Hvilken type arrangement er det?"
                            inputType="text"
                            value={this.state.newEvent.category}
                            name="category"
                            next={this.handleNext}
                            previous={this.handlePrevious}
                            changed={this.handleChange}
                            last
                        />
                    </>
                );
                break;

            case 2:
                current = (
                    <>
                        <BasicForm
                            title="Hvor skal arrangementet være?"
                            inputType="text"
                            value={this.state.newEvent.location}
                            name="location"
                            next={this.handleNext}
                            previous={this.handlePrevious}
                            changed={this.handleChange}
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
                            <p>No artists have been added</p>
                            <button onClick={this.handlePrevious}>
                                Forrige
                            </button>
                            <button onClick={this.handleNext}>Videre</button>
                        </>
                    );
                }
                break;

            case 6:
                current = (
                    <TicketAdder
                        tickets={this.state.newEvent.tickets}
                        save={this.handleSave}
                    />
                );
                break;

            case 7:
                current = (
                    <>
                        <Modal
                            show={this.state.showBackdrop}
                            closed={this.handleToggleBackdrop}
                        >
                            <div>Vil du opprette dette arrangementet?</div>
                            <div>
                                <button onClick={this.handleNewEvent}>
                                    Ja
                                </button>
                                <button onClick={this.handleToggleBackdrop}>
                                    Nei
                                </button>
                            </div>
                        </Modal>
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

        return <div className={classes.CreateEvent}>{current}</div>;
    }
}
