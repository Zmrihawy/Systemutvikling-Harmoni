import React from 'react';

const artistAdder = props => {
    let artistsRemaining = props.artistsCount;

    return <>{props.artistsRemaining}</>;
};

export default artistAdder;
