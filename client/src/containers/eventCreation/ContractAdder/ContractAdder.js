import React, { Component } from 'react';
import Modal from './../../../components/UI/Modal/Modal';

export default class ContractAdder extends Component {
    state = {
        showModal: false
    };

    handleToggleModal = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };

    render() {
        return (
            <>
                Last opp kontrakt
                <button onClick={this.handleNewTicket}> Velg fil </button>
                <Modal
                    show={this.state.showModal}
                    closed={this.handleToggleModal}
                >
                    <button>last opp</button>
                </Modal>
            </>
        );
    }
}
