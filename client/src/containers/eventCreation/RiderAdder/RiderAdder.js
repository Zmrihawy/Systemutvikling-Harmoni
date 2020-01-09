import React, { Component } from 'react';

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
                    <button onClick={this.handleNewRider}>+</button>
                    {el.riders.map((el, i) => {
                        return (
                            <div key={`${index} ${i}`} id={`${index} ${i}`}>
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
                                    onClick={this.handleDeleteRider}
                                    style={{ cursor: 'pointer' }}
                                >
                                    &#10005;
                                </span>
                            </div>
                        );
                    })}
                </div>
            );
        });

        return (
            <>
                <h3>Add riders</h3>
                {artists}
                <button
                    onClick={() =>
                        this.props.save(
                            this.state.artists,
                            'riders',
                            'previous'
                        )
                    }
                >
                    Forrige
                </button>
                <button
                    onClick={() =>
                        this.props.save(this.state.artists, 'riders', 'next')
                    }
                >
                    Videre
                </button>
            </>
        );
    }
}
