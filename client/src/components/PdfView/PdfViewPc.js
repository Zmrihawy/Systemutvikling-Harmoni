import React from 'react';
import { PDFReader } from 'react-read-pdf';

const pdfReader = props => {
    return (
        <div>
            <PDFReader url={props.url} />
        </div>
    );
};

export default pdfReader;
