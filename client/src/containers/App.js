import React from 'react';
import Header from '../components/Header/Header';
import Main from './Main/Main';
import classes from './App.module.scss';
import ViewProfile from "./ViewProfile/ViewProfile";

function App() {
    return (
        /**<div className={classes.App}>
            <Header />
            <Main />
        </div>**/
        <ViewProfile></ViewProfile>
    );
}

export default App;
