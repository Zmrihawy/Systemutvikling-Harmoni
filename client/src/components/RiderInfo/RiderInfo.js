import React from 'react';

import classes from './RiderInfo.module.scss';

import RiderForm from '../RiderForm/RiderForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTimes } from '@fortawesome/free-solid-svg-icons';

const riderInfo = props => {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Rider for {props.artist.name}</h1>

            <div className={classes.rider__list}>
                {props.artist.riders.map((rider, i) => (
                    <div className={classes.rider__wrapper} key={i}>
                        <p className={classes.rider__amount}>{rider.amount}</p>
                        <p className={classes.rider__name}>{rider.name}</p>

                        <button className={classes.button__edit}>
                            <FontAwesomeIcon icon={faPen} />
                        </button>

                        <button className={classes.button__delete}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                ))}

                <RiderForm />
            </div>
        </div>
    );
};

export default riderInfo;
