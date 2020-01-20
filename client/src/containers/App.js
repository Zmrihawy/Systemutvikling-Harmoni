import React from 'react';
import Header from '../components/Header/Header';
import Main from './Main/Main';
import classes from './App.module.scss';
import ViewProfile from './ViewProfile/ViewProfile';
import NavBar from '../components/NavBar/NavBar';
import ErrorBoundary from '../components/ErorrBoundary/ErorrBoundary';

import { createHashHistory } from 'history';
export const history = createHashHistory();

function App() {
    return (
        <div>
            <ErrorBoundary>
            <Main />
            </ErrorBoundary>
        </div>
    );
}

export default App;
