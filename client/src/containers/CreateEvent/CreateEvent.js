import React, { Component } from 'react';
import moment from 'moment';
import BasicForm from '../../components/BasicForm/BasicForm';
import DatePicker from '../../components/eventCreation/DatePicker/DatePicker';
import ArtistAdder from '../eventCreation/ArtistAdder/ArtistAdder';

import classes from './CreateEvent.module.scss';
import StaffAdder from '../eventCreation/StaffAdder/StaffAdder';

export default class CreateEvent extends Component {
  state = {
    currentPage: 0,
    newEvent: {
      title: '',
      category: '',
      location: '',
      image: '',
      dateRange: [new Date(), new Date()],
      timeRange: [moment(), moment()],
      artistsCount: 0,
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

    handleSave = (input, select, action) => {
        let result;
        // Remove empty elements from the array
        if (select === 'artists') {
            result = input.filter(el => el.trim() !== '');
        } else if (select === 'staff') {
            result = input.filter(
                el => el.name.trim() !== '' && el.profession.trim() !== ''
            );
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
                        clicked={this.handleNext}
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
                            clicked={this.handleNext}
                            changed={this.handleChange}
                        />
                        <button onClick={this.handlePrevious}>Forrige</button>
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
                            clicked={this.handleNext}
                            changed={this.handleChange}
                        />
                        <button onClick={this.handlePrevious}>Forrige</button>
                    </>
                );
                break;

            case 3:
                current = (
                    <DatePicker
                        clicked={this.handleNext}
                        dates={this.state.newEvent.dateRange}
                        times={this.state.newEvent.timeRange}
                        dateChanged={this.handleDateChange}
                        timeChanged={this.handleTimeChange}
                    />
                );
                break;

            case 4:
                current = (
                    <>
                        <ArtistAdder
                            artists={this.state.newEvent.artists}
                            save={this.handleSave}
                        />
                    </>
                );
                break;

            case 5:
                current = (
                    <>
                        <StaffAdder
                            staff={this.state.newEvent.staff}
                            save={this.handleSave}
                        />
                    </>
                );
                break;

            default:
                current = <div>TEST</div>;
        }

      [event.target.name]: event.target.value
    };
    console.log(event.target.value);
    console.log(event.target.name);
    this.setState({ newEvent });
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
        current = (
          <DatePicker
            clicked={this.handleNext}
            dates={this.state.newEvent.dateRange}
            times={this.state.newEvent.timeRange}
            dateChanged={this.handleDateChange}
            timeChanged={this.handleTimeChange}
          />
        );
        break;

      case 4:
        current = (
          <BasicForm
            title="Hvor mange artister skal det være?"
            inputType="number"
            value={this.state.newEvent.artistsCount}
            name="artistsCount"
            clicked={this.handleNext}
            changed={this.handleChange}
          />
        );
        break;

      case 5:
        current = (
          <TicketSelection
            ticketSelect={this.ticketSelect}
            clicked={this.handleNext}
          />
        );
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
