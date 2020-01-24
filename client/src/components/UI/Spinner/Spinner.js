import React from 'react';

import classes from './Spinner.module.scss';

// This is a component that will render a spinning circle to show that the server/client is working on something.
const spinner = () => {
    return <div className={classes.Loader}>Loading...</div>;
};

export default spinner;
