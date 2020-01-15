import React, { Component } from 'react';
import classes from './EventOverview.module.scss';

export default class OverviewPage extends Component {
    arrangements = [
        {
            id: 1,
            name: 'Konsert',
            location: 'Trondheim',
            date: '02.02.2020'
        },
        {
            id: 2,
            name: 'Konsert',
            location: 'Trondheim',
            date: '02.02.2020'
        },
        {
            id: 3,
            name: 'Konsert',
            location: 'Trondheim',
            date: '02.02.2020'
        },
        {
            id: 4,
            name: 'Konsert',
            location: 'Trondheim',
            date: '02.02.2020'
        },
        {
            id: 5,
            name: 'Konsert',
            location: 'Trondheim',
            date: '02.02.2020'
        }
    ];

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.grid}>
                    {this.arrangements.map(arr => (
                        <div className={classes.article}>
                            <img className={classes.image} src='https://i.ytimg.com/vi/wj6dGBgBxik/maxresdefault.jpg'/>

                            <div className={classes.text}>
                                <h3>{arr.name}</h3>
                                <p>Location: {arr.location} </p>
                                <p>Date: {arr.date} </p>
                                <button>More details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
