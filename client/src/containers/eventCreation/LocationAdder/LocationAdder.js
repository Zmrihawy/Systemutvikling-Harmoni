import React from 'react';

import BasicForm from '../../../components/BasicForm/BasicForm';
import Map from '../../../components/Map/Map';
import classes from './LocationAdder.module.scss';

const locationAdder = props => {
    return (
        <div className={classes.LocationAdder}>
            <div>
                <BasicForm
                    key={props.key}
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

            <div style={{ textAlign: 'center' }}>
                <em style={{ fontSize: '2.5rem' }}>
                    Plasser pekeren på ønsket sted
                </em>
                <div
                    style={{
                        height: '58vh',
                        width: '58vh',
                        boxShadow: '0 1rem 2rem rgba(0,0,0,0.7)'
                    }}
                >
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
