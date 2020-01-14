import React, { Component } from 'react';
import classes from './NavBar.module.scss';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <>
                <div className={classes.navBar}>
                    <div
                        className={classes.activeLink}
                        id="eventLink"
                        onClick={event => {
                            this.changePage('eventLink');
                        }}
                    >
                        Mine Arrangement
                    </div>
                    <div
                        className={classes.navLink}
                        id="createLink"
                        onClick={event => {
                            this.changePage('createLink');
                        }}
                    >
                        Lage Arrangement
                    </div>
                    <div
                        className={classes.navLink}
                        id="profileLink"
                        onClick={event => {
                            this.changePage('profileLink');
                        }}
                    >
                        Min Profil
                    </div>
                    <div
                        className={classes.navLink}
                        id="logLink"
                        onClick={event => {
                            this.changePage('logLink');
                        }}
                    >
                        Logge Ut
                    </div>
                </div>
            </>
        );
    }
    changePage(id) {
        if (
            document.getElementsByClassName('' + classes.activeLink + '') !==
            null
        ) {
            console.log('yes');
            console.log(id);
            if (document.getElementById(id) !== null) {
                console.log('yes2');
                document.getElementsByClassName(
                    classes.activeLink
                )[0].className = '' + classes.navLink + '';
                document.getElementById(id).className =
                    '' + classes.activeLink + '';
            }
        }
    }
}
