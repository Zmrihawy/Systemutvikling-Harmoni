import React, {Component} from 'react';
import Header from '../components/Header/Header';
import UpperLayer from './UpperLayer.js';

export default class ViewProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            user: null
        };
    }

    render(){
        return(
            <div id="profile">
                <Header id="header">
                    My Profile
                </Header>
                <UpperLayer id="upperLayer">
                    UpperLayer
                </UpperLayer>
            </div>
        )
    }
}
