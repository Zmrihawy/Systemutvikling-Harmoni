import React from 'react';
import Header from '../components/Header/Header';
import Main from './Main/Main';

import classes from './App.module.scss';

function App() {
    return (
        <div className={classes.App}>
            <Header />
            <Main />
        </div>
    );
}

export default App;
