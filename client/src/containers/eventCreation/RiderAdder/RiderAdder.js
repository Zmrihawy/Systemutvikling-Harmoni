import React, { Component } from 'react';

import classes from './RiderAdder.module.scss';

export default class RiderAdder extends Component {
    state = {
        artists: this.props.artists
    };

    handleChange = event => {
        const artists = [...this.state.artists];
        const id = event.target.parentNode.id;
        artists[id.split(' ')[0]].riders[id.split(' ')[1]][event.target.name] =
            event.target.value;

        this.setState({ artists });
    };

    handleNewRider = event => {
        const artists = [...this.state.artists];
        const id = event.target.parentNode.id;
        artists[id].riders.push({ description: '', amount: '' });

        this.setState({ artists });
    };

    handleDeleteRider = event => {
        const id = event.target.parentNode.id;
        const artists = [...this.state.artists];
        const ids = id.split(' ');
        artists[ids[0]].riders.splice(ids[1], 1);

        this.setState({ artists });
    };

    render() {
        let artists = this.state.artists.map((el, index) => {
            return (
                <div id={index} key={index}>
                    {el.name}
                    <br />
                    <button
                        className="Button Button--add"
                        onClick={this.handleNewRider}
                    >
                        Ny rider
                    </button>
                    <div>
                        {el.riders.map((el, i) => {
                            return (
                                <div
                                    key={`${index} ${i}`}
                                    id={`${index} ${i}`}
                                    style={{ direction: 'ltr' }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Beskrivelse"
                                        name="description"
                                        onChange={this.handleChange}
                                        value={
                                            this.state.artists[index].riders[i]
                                                .description
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Antall"
                                        name="amount"
                                        onChange={this.handleChange}
                                        value={
                                            this.state.artists[index].riders[i]
                                                .amount
                                        }
                                    />
                                    <span
                                        className="Deleter"
                                        onClick={this.handleDeleteRider}
                                    >
                                        &#10005;
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        });

        return (
            <>
                <div className="MediumTitle">Har artistene riders?</div>
                <div className="Scroll">{artists}</div>

                <div>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                this.state.artists,
                                'riders',
                                'previous'
                            )
                        }
                    >
                        Tilbake
                    </button>
                    <button
                        className="Button"
                        onClick={() =>
                            this.props.save(
                                this.state.artists,
                                'riders',
                                'next'
                            )
                        }
                    >
                        Neste
                    </button>
                </div>
            </>
        );
    }
}
