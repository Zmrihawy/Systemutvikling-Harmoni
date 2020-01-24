import React, { Component } from 'react';
import { PDFReader } from 'react-read-pdf';

import classes from './PdfView.module.scss';

class PdfView extends Component {
    state = {
        showBackdrop: false
    };

    handleToggleBackdrop = () => {
        this.state.showBackdrop
            ? this.setState({ showBackdrop: false })
            : this.setState({ showBackdrop: true });
    };

    render() {
        if (this.props.url === 'TOM') {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={classes.PDF}>
                    <PDFReader showAllPage width={720} url={this.props.url} />
                </div>
            );
        }
    }
}
export default PdfView;
