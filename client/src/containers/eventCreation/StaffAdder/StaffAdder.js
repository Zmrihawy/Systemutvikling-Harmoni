import React, { Component } from 'react';

export default class StaffAdder extends Component {
    state = {
        staff: this.props.staff
    };

    handleNewStaff = () => {
        let staff = this.state.staff;
        staff.push({
            name: '',
            profession: ''
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
                <button onClick={this.handleNewStaff}>Legg til</button>
                {this.state.staff.map((el, i) => {
                    return (
                        <div key={i} id={i}>
                            <input
                                type="text"
                                placeholder="Stilling"
                                onChange={this.handleChange}
                                value={el.profession}
                                name="profession"
                            />
                            <input
                                type="text"
                                placeholder="Navn"
                                onChange={this.handleChange}
                                value={el.name}
                                name="name"
                            />
                            <span
                                onClick={this.handleDeleteStaff}
                                style={{ cursor: 'pointer' }}
                            >
                                &#10005;
                            </span>
                        </div>
                    );
                })}
                <button
                    onClick={() =>
                        this.props.save(this.state.staff, 'staff', 'next')
                    }
                >
                    Neste
                </button>
                <button
                    onClick={() =>
                        this.props.save(this.state.staff, 'staff', 'previous')
                    }
                >
                    Forrige
                </button>
            </>
        );
    }
}
