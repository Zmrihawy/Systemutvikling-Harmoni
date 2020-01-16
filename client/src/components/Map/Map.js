import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { Popup, ZoomControl } from 'react-mapbox-gl';

const MapBox = ReactMapboxGl({
    accessToken: 'pk.eyJ1Ijoia3ZpbmxhdWdsb3ZlcjY0IiwiYSI6ImNrNTVid25kYTBld20zZnJ1bWQ5ODF1bXEifQ.8Ui5ppovKsFXEpf4hGM9Qw',
    scrollZoom:false
});

const map = props => {
    return (
        <MapBox
            style='mapbox://styles/mapbox/streets-v9'
            containerStyle={{
                height: '100%',
                width: '100%'
            }}
            center={[props.longitude, props.latitude]}
            onClick={(props.handleMapClick)}
        >
            <Popup coordinates={[props.longitude, props.latitude]}>
                <h1>{props.location}</h1>
            </Popup>
            <ZoomControl/>
        </MapBox>

    );
};
export default map;

