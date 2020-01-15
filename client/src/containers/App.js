import React from 'react';
import Header from '../components/Header/Header';
import Main from './Main/Main';
import classes from './App.module.scss';
import ViewProfile from './ViewProfile/ViewProfile';
import NavBar from '../components/NavBar/NavBar';

import { createHashHistory } from 'history';
export const history = createHashHistory();

function App() {
    return (
        /**<div className={classes.App}>
            <Header />
            <Main />
        </div>**/
        <div>
            {/*<NavBar></NavBar>
            <ViewProfile></ViewProfile>*/}
            <Main />
        </div>
    );
}

export default App;
