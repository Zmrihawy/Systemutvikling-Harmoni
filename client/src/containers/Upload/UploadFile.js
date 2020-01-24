import React, { Component } from 'react';
import Progress from './Progress/Progress';
import Dropzone from './Dropzone/Dropzone';
import './Upload.css';

class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            uploadProgress: {},
            successfullUploaded: false
        };
    }

    async uploadFiles() {
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        this.props.files.forEach(file => {
            promises.push(this.sendRequest(file, 1, 2));
        });
        try {
            await Promise.all(promises);

            this.setState({ successfullUploaded: true, uploading: false });
        } catch (e) {
            this.setState({ successfullUploaded: true, uploading: false });
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
                </div>
            );
        }
    }

    render() {
        return (
            <div className="Upload">
                <p className="Title">
                    Filtypen <em style={{ color: '#ff9f43' }}>må</em> være PDF
                </p>
                <div className="Content">
                    <div>
                        <Dropzone
                            onFilesAdded={this.props.filesAdded}
                            disable={
                                this.state.uploading ||
                                this.state.successfullUploaded
                            }
                        />
                    </div>
                    <div className="Files">
                        {this.props.files
                            .filter((file, index) => {
                                return index == this.props.callerID;
                            })
                            .map((file, i) => {
                                console.log(this.props.callerID + ' ' + i);
                                if (!file) return;
                                if (file.length < 1) return;

                                return (
                                    <div key={file[0].name} className="Row">
                                        <span className="Filename">
                                            {' '}
                                            {file[0].name}
                                            <button
                                                onClick={() =>
                                                    this.props.clearFiles(i)
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
            </div>
        );
    }
}

export default UploadFile;
