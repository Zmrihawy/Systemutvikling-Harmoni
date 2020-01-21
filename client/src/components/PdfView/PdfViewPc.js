import React, { Component } from 'react';
import { PDFReader } from 'react-read-pdf';
import { eventService } from './../../services';
import Modal from './../UI/Modal/Modal';

class PdfReader extends Component {
    state = {
        URL: 'TOM',
        showBackdrop: false
    };

    handleToggleBackdrop = () => {
        this.state.showBackdrop
            ? this.setState({ showBackdrop: false })
            : this.setState({ showBackdrop: true });
    };

    componentDidMount() {
        let url = eventService
            .getContract(this.props.eventId, this.props.performanceId)
            .then(data => {
                this.setState({ URL: data });
            });
    }

    render() {
        if (this.state.URL === 'TOM') {
            return <div>Loading...</div>;
        } else {
            return (
                <>
                    <PDFReader url={this.state.URL} />
                </>
            );
        }
    }
}
export default PdfReader;
