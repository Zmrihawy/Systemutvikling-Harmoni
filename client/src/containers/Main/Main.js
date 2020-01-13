import React, { Component } from 'react';

import CreateEvent from '../CreateEvent/CreateEvent';
import DisplayEvent from '../DisplayEvent/DisplayEvent';
import DisplayRider from '../DisplayRider/DisplayRider';
import NavBar from '../../components/NavBar/NavBar';

export default class Main extends Component {
    render() {
        return (
            <>
                {/*<DisplayEvent />*/}
                <NavBar />
                <CreateEvent />
            </>
        );
    }
}
