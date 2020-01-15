import React, { Component } from 'react';
import RiderInfo from '../../components/RiderInfo/RiderInfo';

import { history } from '../App'; 

export default class DisplayRider extends Component {
    handleBackClick = (e) => {
        e.preventDefault(); 
        history.goBack(); 
    }

    render() {
        let artist = {
            name: 'Steven Kvinlaug',
            image: 'https://www.kvinesdal24.no/images/4817c829-a1f7-45b7-90cf-f3cbd4a64109?fit=crop&q=80&w=580',
            riders: [
                {
                    amount: 3,
                    name: 'pepsi'
                },
                {
                    amount: 4,
                    name: 'cola'
                }, 
                {
                    amount: 1,
                    name: 'johan'
                }, 
                
                {
                    amount: 1,
                    name: 'toga'
                }, 
                
                {
                    amount: 1,
                    name: 'samfuned'
                }, 
                {
                    amount: 4,
                    name: 'latexlaken'
                },
                {
                    amount: 4,
                    name: 'banan'
                }, 
                {
                    amount: 4,
                    name: 'engangshansker'
                }, 
            ]
        };

        return <RiderInfo 
        artist={artist}
        handleBackClick={this.handleBackClick} />;
    }
}
