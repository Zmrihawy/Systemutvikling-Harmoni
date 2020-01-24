import React from 'react';

import BasicForm from '../../../components/BasicForm/BasicForm';
import Map from '../../../components/Map/Map';
import classes from './LocationAdder.module.scss';

// A component part of event registration that handles the description
const locationAdder = props => {
    return (
        <div className={classes.LocationAdder}>
            <div className={classes.LocationAdder__input}>
                <BasicForm
                    title={props.title}
                    inputType="text"
                    value={props.value}
                    name="location"
                    next={props.next}
                    previous={props.previous}
                    changed={props.changed}
                    last
                />
            </div>

            <div
                style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <em className={classes.LocationAdder__map__hint}>
                    Plasser pekeren på ønsket sted
                </em>
                <div className={classes.LocationAdder__map}>
                    {/* An installed component that will show locations on a map in order to help the user */}
                    <Map
                        zoom={false}
                        longitude={props.longitude}
                        latitude={props.latitude}
                        location={props.value}
                        handleMapClick={props.mapClicked}
                    />
                </div>
            </div>
        </div>
    );
};

export default locationAdder;
