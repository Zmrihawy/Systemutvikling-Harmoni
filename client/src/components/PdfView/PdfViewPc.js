import React, { Component } from 'react';
import { PDFReader } from 'react-read-pdf';
import { eventService } from './../../services';
import Modal from './../UI/Modal/Modal';

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

    componentDidMount() {
        /* console.log('info');
        console.log(this.props.eventId);
        console.log(this.props.artist); */
        /* let url = eventService
            .getContract(this.props.eventId, this.props.performanceId)
            .then(data => {
                if (!data) return;
                this.setState({ URL: data });
            }); */
    }

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
