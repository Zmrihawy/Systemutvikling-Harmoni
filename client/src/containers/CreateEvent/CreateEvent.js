import React, { Component } from 'react';

import BasicForm from '../../components/BasicForm/BasicForm';

export default class CreateEvent extends Component {
    state = {
        currentPage: 0
    };

    render() {
        return (
            <div>
                <BasicForm title="Hva skal arrangementet hete?" />
            </div>
        );
    }
}
