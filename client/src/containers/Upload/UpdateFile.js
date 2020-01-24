import React, { Component } from 'react';
import Progress from './Progress/Progress';
import Dropzone from './Dropzone/Dropzone';
import './Upload.css';
import { eventService } from './../../services';

class UpdateFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false
        };

        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.renderActions = this.renderActions.bind(this);
    }

    onFilesAdded(files) {
        this.setState(prevState => ({
            files: files
        }));
    }

    sendRequest(file, eventId, performanceId) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            const formData = new FormData();
            formData.append('file', file, file.name);

            req.open(
                'PUT',
                '/api/event/' +
                    eventId +
                    '/performance/' +
                    performanceId +
                    '/contract'
            );

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);
        });
    }

    async uploadFiles() {
        this.props.toggleModal();
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(
                this.sendRequest(
                    file,
                    this.props.eventId,
                    this.props.performanceId
                )
            );
        });
        try {
            await Promise.all(promises);
            window.location.reload();

            this.setState({ successfullUploaded: true, uploading: false });
        } catch (e) {
            this.setState({ successfullUploaded: true, uploading: false });
        }
    }

    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfullUploaded) {
            console.log(uploadProgress);
            return (
                <div className="ProgressWrapper">
                    <Progress
                        progress={
                            uploadProgress ? uploadProgress.percentage : 0
                        }
                    />
                </div>
            );
        }
    }

    renderActions() {
        if (this.state.successfullUploaded) {
            return (
                <button
                    className="uploadButton"
                    onClick={() =>
                        this.setState({ files: [], successfullUploaded: false })
                    }
                >
                    Clear
                </button>
            );
        } else {
            return (
                <button
                    className="uploadButton"
                    disabled={
                        this.state.files.length < 0 || this.state.uploading
                    }
                    onClick={this.uploadFiles}
                >
                    Last opp
                </button>
            );
        }
    }

    render() {
        console.log(this.state.files);

        return (
            <div className="Upload">
                <span className="Title">
                    Filtype <em style={{ color: '#ff9f43' }}>må</em> være PDF
                </span>
                <div className="Content">
                    <div>
                        <Dropzone
                            onFilesAdded={this.onFilesAdded}
                            disable={
                                this.state.uploading ||
                                this.state.successfullUploaded
                            }
                        />
                    </div>
                    <div className="Files">
                        {this.state.files.map(file => {
                            return (
                                <div key={file.name} className="Row">
                                    <span className="Filename">
                                        {' '}
                                        {file.name}
                                        <button
                                            onClick={() =>
                                                this.setState({ files: [] })
                                            }
                                        >
                                            {' '}
                                            X{' '}
                                        </button>
                                    </span>
                                    {this.renderProgress(file)}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="Actions"> {this.renderActions()} </div>
            </div>
        );
    }
}

function refreshToken(jwt) {
    window.sessionStorage.setItem('jwt', jwt);
}

export default UpdateFile;
