import React, { Component } from 'react';

import classes from '../TicketAdder/TicketAdder';

export default class StaffAdder extends Component {
    state = {
        staff: this.props.staff
    };

    handleNewStaff = () => {
        let staff = this.state.staff;
        staff.push({
            name: '',
            profession: '',
            contact: ''
        });

        this.setState({ staff });
    };

    handleDeleteStaff = event => {
        let staff = [...this.state.staff];
        staff.splice(event.target.parentNode.id, 1);

        this.setState({ staff });
    };

    handleChange = event => {
        let staff = [...this.state.staff];
        const id = event.target.parentNode.id;
        staff[id][event.target.name] = event.target.value;

        this.setState({ staff });
    };

    render() {
        return (
            <>
                <button
                    className="Button Button--add"
                    onClick={this.handleNewStaff}
                >
                    Nytt personell
                </button>
                <div className="Adder">
                    {this.state.staff.map((el, i) => {
                        return (
                            <div key={i} id={i} style={{ direction: 'ltr' }}>
                                <input
                                    className="Input"
                                    type="text"
                                    placeholder="Stilling"
                                    onChange={this.handleChange}
                                    value={el.profession}
                                    name="profession"
                                />
                                <input
                                    className="Input"
                                    type="text"
                                    placeholder="Navn"
                                    onChange={this.handleChange}
                                    value={el.name}
                                    name="name"
                                />
                                <input
                                    className="Input"
                                    type="text"
                                    placeholder="Kontaktinfo"
                                    onChange={this.handleChange}
                                    value={el.contact}
                                    name="contact"
                                />
                                <span
                                    className="Deleter"
                                    onClick={this.handleDeleteStaff}
                                    style={{ cursor: 'pointer' }}
                                >
                                    &#10005;
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                this.state.staff,
                                'staff',
                                'previous'
                            )
                        }
                    >
                        &larr; Tilbake
                    </button>
                    <button
                        className="Button"
                        onClick={() => {
                            this.props.finished(this.state.staff, 'staff', '');
                        }}
                    >
                        Opprett &#10004;
                    </button>
                </div>
            </>
        );
    }
}
