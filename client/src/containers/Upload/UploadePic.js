import React, { Component } from 'react';
import Progress from './Progress/Progress';
import Dropzone from './Dropzone/Dropzone';
import './Upload.scss';

const userId = window.sessionStorage.getItem('user');
class UploadPic extends Component {
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
            files: prevState.files.concat(files)
        }));
    }

    sendRequest(file, userId) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();

            const formData = new FormData();
            formData.append('file', file, file.name);

            req.open('PUT', '/api/user/' + userId + '/picture');

            req.setRequestHeader(
                'x-access-token',
                window.sessionStorage.getItem('jwt')
            );

            req.send(formData);
        });
    }

    async uploadFiles() {
        const promises = [];
        this.state.files.forEach(file => {
            promises.push(this.sendRequest(file, userId));
        });
        try {
            await Promise.all(promises).then(setTimeout(()=>window.location.reload(),1000));
        } catch (e) {
            console.log(e.error);
        }
    }

    renderProgress(file) {
        const uploadProgress = this.state.uploadProgress[file.name];
        if (this.state.uploading || this.state.successfullUploaded) {
            return (
                <div className="ProgressWrapper">
                    <Progress
                        progress={
                            uploadProgress ? uploadProgress.percentage : 0
                        }
                    />
                    <img
                        className="CheckIcon"
                        alt="done"
                        src="baseline-check_circle_outline-24px.svg"
                        style={{
                            opacity:
                                uploadProgress &&
                                uploadProgress.state === 'done'
                                    ? 0.5
                                    : 0
                        }}
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
                    Fjern
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
        return (
            <div className="Upload">
                <h1>Last opp fil, må være et bildeformat!</h1>
                <div className="Content">
                    <div>
                        <Dropzone
                            picture
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

export default UploadPic;
