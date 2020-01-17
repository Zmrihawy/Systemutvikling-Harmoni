import React, { Component } from 'react';
import classes from './NavBar.module.scss';

import { history } from '../../containers/App';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if(window.sessionStorage.getItem('jwt') == undefined) return null;
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
            if (document.getElementById(id) !== null) {
                document.getElementsByClassName(
                    classes.activeLink
                )[0].className = '' + classes.navLink + '';
                document.getElementById(id).className =
                    '' + classes.activeLink + '';

                switch (id) {
                    case 'profileLink':
                        history.push(
                            '/user/' + window.sessionStorage.getItem('user')
                        );
                        break;
                    case 'createLink':
                        history.push('/registrerarrangement');
                        break;
                    case 'eventLink':
                        history.push(
                            '/arrangement'
                        );
                        break;
                    case 'logLink':
                        window.sessionStorage.removeItem('jwt');
                        window.sessionStorage.removeItem('user');
                        history.push('/');
                        break;
                }
            }
        }
    }
}
