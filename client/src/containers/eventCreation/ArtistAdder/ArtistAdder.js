import React, { Component } from 'react';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';

import classes from './ArtistAdder.module.scss';
import { userService } from '../../../services';

export default class ArtistAdder extends Component {
    state = {
        showModal: false,
        loading: true,
        artists: this.props.artists,
        artistInput: '',
        artistOptions: [],
        newArtistOptions: this.props.artistOptions
    };

    componentDidMount() {
        userService
            .getAllArtists()
            .then(response => {
                console.log('[Response] ArtistAdder:');
                console.log(response);

                const artistNames = response.map(artist => {
                    return {
                        id: artist.id,
                        name: `${artist.firstName} ${artist.surname}`
                    };
                });

                this.setState({ artistOptions: artistNames, loading: false });
            })
            .then(el => {
                console.log(this.state.artistOptions);
            })
            .catch(error => console.error(error));
    }

    handleNewArtist = () => {
        let artists = [...this.state.artists];
        artists.push({ id: -1, name: '', riders: [] });

        this.setState({ artists });
    };

    handleDeleteArtist = event => {
        let artists = [...this.state.artists];
        artists.splice(event.target.parentNode.id, 1);

        this.setState({ artists });
    };

    handleChange = event => {
        if (event.target.name == 'artistInput') {
            this.setState({ artistInput: event.target.value });
        } else {
            let artists = [...this.state.artists];
            const parentID = event.target.parentNode.id;

            // Get ID of selected option (userID)
            // --> if this is > -1, it means this artist has a useraccount
            const id = event.target.childNodes[
                event.target.selectedIndex
            ].getAttribute('id');

            // Set the changed values in the state equal to those selected
            artists[parentID].name = event.target.value;
            artists[parentID].id = id;

            this.setState({ artists });
        }
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    handleCustomArtist = () => {
        let newArtistOptions = [...this.state.newArtistOptions];
        const artistInput = this.state.artistInput;
        if (artistInput.trim()) {
            newArtistOptions.push({
                id: -1,
                name: this.state.artistInput
            });

            this.setState({ newArtistOptions, artistInput: '' });
            this.handleToggleModal();
            console.log(this.state.artists);
        } else {
            alert('En artist må ha et navn!');
        }
    };

    render() {
        let artistOptions;
        if (this.state.artistOptions) {
            console.log(
                this.state.artistOptions.concat(this.state.newArtistOptions)
            );

            artistOptions = this.state.artistOptions
                .concat(this.state.newArtistOptions)
                .map((option, i) => {
                    return (
                        <option id={option.id} key={i} value={option.name}>
                            {option.name}
                        </option>
                    );
                });
        }

        let artistsView;
        if (!this.state.loading) {
            artistsView = (
                <>
                    <div className="MediumTitle">Hvilke artister kommer?</div>
                    <button
                        className="Button Button--add"
                        onClick={this.handleNewArtist}
                    >
                        Legg til
                    </button>
                    <Modal
                        show={this.state.showModal}
                        closed={this.handleToggleModal}
                    >
                        <div className="MediumTitle">Ny artist</div>
                        <input
                            type="text"
                            name="artistInput"
                            onChange={this.handleChange}
                            value={this.state.artistInput}
                            className="Input"
                            style={{ marginTop: '1rem' }}
                            required
                        />
                        <button
                            className="Button Button--add"
                            onClick={this.handleCustomArtist}
                        >
                            Legg til
                        </button>
                    </Modal>
                    <div className={classes.ArtistAdder__fields}>
                        {this.state.artists.map((el, i) => {
                            return (
                                <div key={i} id={i}>
                                    <select
                                        className="Input"
                                        title="Artist"
                                        onChange={this.handleChange}
                                        value={el.name}
                                        name="artist"
                                    >
                                        <option
                                            value=""
                                            selected
                                            disabled
                                            hidden
                                        >
                                            Velg artist
                                        </option>
                                        {artistOptions}
                                    </select>
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
                    <button
                        className="Button Button--add"
                        style={{ marginTop: '2rem', fontSize: '1.4rem' }}
                        onClick={this.handleToggleModal}
                    >
                        Ny artist
                    </button>
                    <div className={classes.ArtistAdder__buttons}>
                        <button
                            className="Button Button--inverse"
                            onClick={() =>
                                this.props.save(
                                    [
                                        this.state.artists,
                                        this.state.newArtistOptions
                                    ],
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
                                    [
                                        this.state.artists,
                                        this.state.newArtistOptions
                                    ],
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
        } else {
            artistsView = <Spinner />;
        }

        return <>{artistsView}</>;
    }
}
