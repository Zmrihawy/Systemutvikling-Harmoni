import React, { Component } from 'react';
import classes from './NavBar.module.scss';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div id="container">
                <div className={classes.navBar}>
                    <div className={classes.activeLink} id='eventLink' onClick={this.changePage('eventLink')}>My Events</div>
                    <div className={classes.navLink} id='createLink' onClick={this.changePage('createLink')}>Create Event</div>
                    <div className={classes.navLink} id='profileLink' onClick={this.changePage('profileLink')}>My Profile</div>
                    <div className={classes.navLink} id='logLink' onClick={this.changePage('logLink')}>Log Out</div>
                </div>
                <br/>
            </div>
        )
    }
    changePage(id){
        if( document.getElementsByClassName(classes.activeLink) !== null &&  document.getElementById(id) !== null){
            document.getElementsByClassName(classes.activeLink).className = "" + classes.navLink + "";
            document.getElementById(id).className = "" + classes.activeLink + "";
        }
    }
}