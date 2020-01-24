import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';

import DisplayEventOverview from '../DisplayEventOverview/DisplayEventOverview';
import Login from '../Login/Login';
import Registration from '../Registration/Registration';
import CreateEvent from '../CreateEvent/CreateEvent';
import DisplayEvent from '../DisplayEvent/DisplayEvent';
import DisplayRiderEdit from '../DisplayRiderEdit/DisplayRiderEdit';
import ViewProfile from '../ViewProfile/ViewProfile';
import DisplayEventEdit from '../DisplayEventEdit/DisplayEventEdit';
import DisplayStaffEdit from '../DisplayStaffEdit/DisplayStaffEdit';
import DisplayTicketEdit from '../DisplayTicketEdit/DisplayTicketEdit';
import DisplayArtistEdit from '../DisplayArtistEdit/DisplayArtistEdit';
import Header from '../../components/Header/Header';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

export default class Main extends Component {
    render() {
        return (
            <HashRouter>
                <Route path="/" component={NavBar} />
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/registrer" component={Registration} />
                <Route exact path="/glemt" component={ForgotPassword} />
                <Route
                    exact
                    path="/arrangement"
                    component={DisplayEventOverview}
                />
                <Route exact path="/arrangement/:id" component={DisplayEvent} />
                <Route
                    exact
                    path="/arrangement/:id/rediger"
                    component={DisplayEventEdit}
                />
                <Route
                    exact
                    path="/arrangement/:eventId/rediger/rider/:performanceId"
                    component={DisplayRiderEdit}
                />

                <Route
                    exact
                    path="/registrerarrangement"
                    component={CreateEvent}
                />
                <Route exact path="/user/:id" component={ViewProfile} />

                <Route
                    exact
                    path="/arrangement/:id/rediger/artister"
                    component={DisplayArtistEdit}
                />
                <Route
                    exact
                    path="/arrangement/:id/rediger/billetter"
                    component={DisplayTicketEdit}
                />
                <Route
                    exact
                    path="/arrangement/:id/rediger/personell"
                    component={DisplayStaffEdit}
                />
            </HashRouter>
        );
    }
}
