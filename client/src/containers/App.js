import React from 'react';
import Main from './Main/Main';
import classes from './App.module.scss';

import { createHashHistory } from 'history';
export const history = createHashHistory();

function App() {
    return (
        <div>
            <Main />
        </div>
    );
}

export default App;
