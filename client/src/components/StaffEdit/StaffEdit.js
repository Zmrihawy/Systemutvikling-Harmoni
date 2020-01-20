import React from 'react';

import classes from '../StaffEdit/StaffEdit.module.scss';

const staffEdit = props => {
    console.log(props);

    return (
        <div>
            {props.staff.map(e => (
                <p>e</p>
            ))}
        </div>
    );
};

export default staffEdit;
