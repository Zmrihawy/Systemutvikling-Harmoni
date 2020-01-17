import React from 'react';
import { MobilePDFReader } from 'react-read-pdf';

const mobilePdfReader = props => {
    return (
        <div>
            <MobilePDFReader url={props.url} />
        </div>
    );
};

export default mobilePdfReader;
