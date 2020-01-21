import React, { Component } from 'react';

import classes from './ArtistAdder.module.scss';

export default class ArtistAdder extends Component {
    state = {
        artists: this.props.artists
    };

    handleNewArtist = () => {
        let artists = [...this.state.artists];
        artists.push({ name: '', riders: [] });

        this.setState({ artists });
    };

    handleDeleteArtist = event => {
        let artists = [...this.state.artists];
        artists.splice(event.target.parentNode.id, 1);

        this.setState({ artists });
    };

    handleChange = event => {
        let artists = [...this.state.artists];
        const id = event.target.parentNode.id;
        artists[id].name = event.target.value;

        this.setState({ artists });
    };

    render() {
        return (
            <>
                <div className="MediumTitle">Hvilke artister kommer?</div>
                <button
                    className="Button Button--add"
                    onClick={this.handleNewArtist}
                >
                    Legg til
                </button>
                <div className={classes.ArtistAdder__fields}>
                    {this.state.artists.map((el, i) => {
                        return (
                            <div key={i} id={i}>
                                <input
                                    type="text"
                                    placeholder="Navn"
                                    onChange={this.handleChange}
                                    value={el.name}
                                    className="Input Input--small"
                                />
                                <div
                                    onClick={this.handleDeleteArtist}
                                    className="Deleter"
                                >
                                    &#10005;
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={classes.ArtistAdder__buttons}>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                this.state.artists,
                                'artists',
                                'previous'
                            )
                        }
                    >
                        &larr; Tilbake
                    </button>
                    <button
                        autoFocus
                        className="Button"
                        onClick={() =>
                            this.props.save(
                                this.state.artists,
                                'artists',
                                'next'
                            )
                        }
                    >
                        Neste &rarr;
                    </button>
                </div>
            </>
        );
    }
}
