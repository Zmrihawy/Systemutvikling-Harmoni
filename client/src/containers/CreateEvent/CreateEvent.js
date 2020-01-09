import React, { Component } from 'react';
import BasicForm from '../../components/BasicForm/BasicForm';
import DatePicker from '../../components/eventCreation/DatePicker/DatePicker';

import classes from './CreateEvent.module.scss';

export default class CreateEvent extends Component {
    state = {
        currentPage: 0,
        newEvent: {
            title: '',
            category: '',
            location: '',
            image: '',
            dateFrom: null,
            dateTo: null,
            artists: [
                {
                    name: '',
                    riders: ['']
                }
            ],
            tickets: [
                {
                    description: '',
                    amount: null,
                    price: null
                }
            ],
            staff: [
                {
                    name: '',
                    profession: ''
                }
            ]
        }
    };

    handleChange = event => {
        const newEvent = {
            ...this.state.newEvent,
            [event.target.name]: event.target.value
        };

        this.setState({ newEvent });
    };

    handleNext = event => {
        event.preventDefault();
        let page = ++this.state.currentPage;
        this.setState({ currentPage: page });
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
                        clicked={this.handleNext}
                        changed={this.handleChange}
                    />
                );
                break;

            case 1:
                current = (
                    <BasicForm
                        title="Hvilken type arrangement er det?"
                        inputType="text"
                        value={this.state.newEvent.category}
                        name="category"
                        clicked={this.handleNext}
                        changed={this.handleChange}
                    />
                );
                break;

            case 2:
                current = (
                    <BasicForm
                        title="Hvor skal arrangementet være?"
                        inputType="text"
                        value={this.state.newEvent.location}
                        name="location"
                        clicked={this.handleNext}
                        changed={this.handleChange}
                    />
                );
                break;

            case 3:
                current = <DatePicker />;
                break;

            default:
                current = <div>TEST</div>;
        }

        return current;
    };

    render() {
        let current = this.getCurrentPage();

        return <div className={classes.CreateEvent}>{current}</div>;
    }
}
