import React, { Component } from 'react';

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
                <div>Hvilke artister kommer?</div>
                <button onClick={this.handleNewArtist}>Legg til</button>
                {this.state.artists.map((el, i) => {
                    return (
                        <div key={i} id={i}>
                            <input
                                type="text"
                                placeholder="Navn"
                                onChange={this.handleChange}
                                value={el.name}
                                className="Input"
                            />
                            <span
                                onClick={this.handleDeleteArtist}
                                style={{ cursor: 'pointer' }}
                            >
                                &#10005;
                            </span>
                        </div>
                    );
                })}
                <button
                    onClick={() =>
                        this.props.save(
                            this.state.artists,
                            'artists',
                            'previous'
                        )
                    }
                >
                    Forrige
                </button>
                <button
                    onClick={() =>
                        this.props.save(this.state.artists, 'artists', 'next')
                    }
                >
                    Videre
                </button>
            </>
        );
    }
}
