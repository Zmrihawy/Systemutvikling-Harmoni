import React, { Component } from 'react';
import Modal from './../../../components/UI/Modal/Modal';
import Upload from '../../Upload/Upload';

export default class ContractAdder extends Component {
    state = {
        showModal: false,
        artists: this.props.artists
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    handleUplodeButton = () => {
        this.handleToggleModal();
    };

    render() {
        let artists = this.state.artists.map((el, index) => {
            return (
                <div id={index} key={index}>
                    {el.name}
                    <br />
                    Last opp kontrakt
                    <button onClick={this.handleUplodeButton}>Velg fil </button>
                    <Modal
                        show={this.state.showModal}
                        closed={this.handleToggleModal}
                    >
                        <Upload />
                    </Modal>
                </div>
            );
        });
        return (
            <>
                <div className="MediumTitle">
                    Vil du laste opp en kontrakt for artisten?
                </div>
                {artists}
                <button
                    onClick={() =>
                        this.props.save(
                            this.state.artists,
                            'riders',
                            'previous'
                        )
                    }
                >
                    &larr; Tilbake
                </button>
                <button
                    autoFocus
                    onClick={() =>
                        this.props.save(this.state.artists, 'riders', 'next')
                    }
                >
                    Neste &rarr;
                </button>
            </>
        );
    }
}
