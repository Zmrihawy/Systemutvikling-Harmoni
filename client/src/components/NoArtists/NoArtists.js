import React from 'react';

// A component to notify the user that no artist have been added.
// Also includes buttons to go back in the event creation process.
const noArtists = props => {
    return (
        <>
            <div className="MediumTitle">{props.title}</div>
            <p>
                Ingen artister har blitt lagt til, gå{' '}
                <span style={{ color: '#8499f0' }}>tilbake</span>
                &nbsp;for å endre.
            </p>
            <div>
                <button
                    className="Button Button--inverse"
                    onClick={props.previous}
                >
                    &larr; Tilbake
                </button>
                <button className="Button" onClick={props.next}>
                    Neste &rarr;
                </button>
            </div>
        </>
    );
};

export default noArtists;
