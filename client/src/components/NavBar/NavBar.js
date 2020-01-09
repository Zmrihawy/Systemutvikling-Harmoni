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
                    <div className={classes.activeLink} id='eventLink' onClick={event => {this.changePage('eventLink')}}>My Events</div>
                    <div className={classes.navLink} id='createLink' onClick={event => {this.changePage('createLink')}}>Create Event</div>
                    <div className={classes.navLink} id='profileLink' onClick={event => {this.changePage('profileLink')}}>My Profile</div>
                    <div className={classes.navLink} id='logLink' onClick={event => {this.changePage('logLink')}}>Log Out</div>
                </div>
                <br/>
            </div>
        )
    }
    changePage(id){
        if(document.getElementsByClassName("" + classes.activeLink + "") !== null){
            console.log('yes');
            console.log(id);
            if(document.getElementById(id) !== null){
                console.log('yes2');
                document.getElementsByClassName(classes.activeLink)[0].className = "" + classes.navLink + "";
                document.getElementById(id).className = "" + classes.activeLink + "";
            }
        }
    }
}