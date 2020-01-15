import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import Login from '../../Login';
import Registration from '../../Registration';
import CreateEvent from '../CreateEvent/CreateEvent';
import DisplayEvent from '../DisplayEvent/DisplayEvent';
import DisplayRider from '../DisplayRider/DisplayRider';
import ViewProfile from '../ViewProfile/ViewProfile';
import Header from '../../components/Header/Header';

export default class Main extends Component {
    render() {
        return (
            <HashRouter>
                <Route path="/" component={NavBar} />
                <Route exact path="/" component={Login} />
                <Route exact path="/registrer" component={Registration} />
                <Route exact path="/arrangement/:id" component={DisplayEvent} />
                <Route
                    exact
                    path="/registrerarrangement"
                    component={CreateEvent}
                />
                <Route exact path="/user/:id" component={ViewProfile} />
                <Route exact path="/arrangement/user/id/rider" component={DisplayRider} />
            </HashRouter>
        );
    }
}
