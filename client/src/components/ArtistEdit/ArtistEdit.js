import React from 'react';

import classes from '../ArtistEdit/ArtistEdit.module.scss';

/**
    Component for adding and deleting artists from an event 
    There are two types of artists: with or without account 
    You can edit the names of artists without an account, 
    the ones with account you can only add or delete 
 */
const artistEdit = props => {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Rediger artister</h1>
            <div className={classes.registered__artists}>
                <h2
                    className={`${classes.registered__title} ${classes.subtitle}`}
                >
                    Registrerte artister
                </h2>
                <div className={classes.registered__list}>
                    {props.registeredArtists.map((artist, i) => (
                        <div className={classes.artist__wrapper} key={i} id={i}>
                            <select
                                className={classes.select__name}
                                value={artist.userId}
                                onChange={props.handleSelectChange}
                            >
                                <option value="" selected disabled hidden>
                                    Velg artist
                                </option>
                                {props.databaseArtists.map((dbArtist, i) => (
                                    <option value={dbArtist.id}>
                                        {dbArtist.firstName +
                                            ' ' +
                                            dbArtist.surname}
                                    </option>
                                ))}
                            </select>
                            <input
                                className={`${classes.button__registered__delete} ${'Button'}`}
                                onClick={event =>
                                    props.handleButtonDeleteClick(event, true)
                                }
                                type="button"
                                value="-"
                            />
                        </div>
                    ))}
                </div>
                <input
                    className={`${classes.button__registered__add} ${'Button'}`}
                    onClick={event => props.handleButtonAddClick(event, true)}
                    type="button"
                    value="+"
                />
            </div>
            <form
                className={classes.unregistered__artists}
                onSubmit={props.handleButtonSubmitClick}
            >
                <h2
                    className={`${classes.unregistered__title} ${classes.subtitle}`}
                >
                    Uregistrerte artister
                </h2>
                <div className={classes.unregistered__list}>
                    {props.unregisteredArtists.map((artist, i) => (
                        <div className={classes.artist__wrapper} key={i} id={i}>
                            <input
                                className={`${classes.input__name} ${'Input'}`}
                                type="text"
                                name="name"
                                value={artist.name}
                                onChange={props.handleInputChange}
                                required
                            />
                            <input
                                className={`${classes.button__delete} ${'Button'}`}
                                onClick={event =>
                                    props.handleButtonDeleteClick(event, false)
                                }
                                type="button"
                                value="-"
                            />
                        </div>
                    ))}
                </div>
                <input
                    className={`${classes.button__unregistered__add} ${'Button'}`}
                    onClick={event => props.handleButtonAddClick(event, false)}
                    type="button"
                    value="+"
                />
                <input
                    className={`${classes.button__submit} ${'Button'}`}
                    type="submit"
                    value="Lagre endringer"
                />
            </form>
        </div>
    );
};

export default artistEdit;
