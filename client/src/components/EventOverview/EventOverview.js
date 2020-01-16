import React, { Component } from 'react';
import classes from './EventOverview.module.scss';

export default class OverviewPage extends Component {
    render() {
        return (
            <div className={classes.container}>
                <div className={classes.grid}>
                    {this.props.events.map(event => (
                        <div className={classes.article} key={event.id}>
                            <img
                                className={classes.image}
                                src="http://media.istockphoto.com/photos/rock-concert-picture-id528906123?k=6&m=528906123&s=612x612&w=0&h=Ed3gQr4QmeJDUVJMKsQMS8tCz06iYPZwcwnRM9FX_HY="
                            />

                            <div className={classes.text}>
                                <h3>{event.name}</h3>
                                <p>Sted: {event.location} </p>
                                <p>
                                    Dato:{' '}
                                    {new Date(event.startTime)
                                        .toUTCString()
                                        .slice(0, -7)}{' '}
                                </p>
                                <button onClick={() => this.props.handleButtonClick(event.id)}>Les mer</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
