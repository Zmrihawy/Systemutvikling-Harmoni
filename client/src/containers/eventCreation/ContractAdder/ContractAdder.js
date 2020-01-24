import React, { Component } from 'react';
import Modal from './../../../components/UI/Modal/Modal';
import UploadFile from '../../Upload/UploadFile';
import Type from '../../../components/UI/Type/Type';
import Spinner from '../../../components/UI/Spinner/Spinner';

import classes from './ContractAdder.module.scss';

export default class ContractAdder extends Component {
    state = {
        showModal: false,
        artists: this.props.artists,
        files: this.props.contracts || new Array(this.props.artists.length),
        callerID: null
    };

    handleFilesAdded = newFiles => {
        let files = [...this.state.files];
        files[this.state.callerID] = newFiles;

        this.setState({ files });
    };

    handleClearFiles = index => {
        let files = [...this.state.files];
        files.splice(index, 1);

        this.setState({ files });
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    handleUploadButton = event => {
        const id = event.target.id;

        this.setState({ callerID: id });

        this.handleToggleModal();
    };

    render() {
        let artists = this.state.artists.map((el, index) => {
            return (
                <div id={index} key={index}>
                    {el.name}
                    <br />
                    <button
                        className="Button Button--add"
                        id={index}
                        onClick={this.handleUploadButton}
                    >
                        Velg fil
                    </button>
                    {this.state.files[index] ? (
                        <span style={{ color: '#ff9f43' }}>&nbsp;&#10004;</span>
                    ) : null}
                    <Modal
                        show={this.state.showModal}
                        closed={this.handleToggleModal}
                    >
                        {this.state.callerID ? (
                            <UploadFile
                                key={index}
                                files={this.state.files}
                                filesAdded={this.handleFilesAdded}
                                clearFiles={this.handleClearFiles}
                                callerID={this.state.callerID}
                            />
                        ) : (
                            <Spinner />
                        )}
                        <button
                            className="Button"
                            onClick={this.handleToggleModal}
                        >
                            Lukk
                        </button>
                    </Modal>
                </div>
            );
        });
        return (
            <div className={classes.ContractAdder}>
                <div className="MediumTitle">
                    <Type strings="Vil du laste opp kontrakter?" speed={35} />
                </div>
                {artists}
                <div className={classes.ContractAdder__buttons}>
                    <button
                        className="Button Button--inverse"
                        onClick={() =>
                            this.props.save(
                                this.state.files,
                                'contracts',
                                'previous'
                            )
                        }
                    >
                        &larr; Tilbake
                    </button>
                    <button
                        className="Button"
                        autoFocus
                        onClick={() =>
                            this.props.save(
                                this.state.files,
                                'contracts',
                                'next'
                            )
                        }
                    >
                        Neste &rarr;
                    </button>
                </div>
            </div>
        );
    }
}
