import React, { Component } from 'react';
import classes from './NavBar.module.scss';

import { history } from '../../containers/App';

import icon from '../../pictures/icon4.png';
import icon2 from '../../pictures/icon3.png';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if(window.sessionStorage.getItem('jwt') == undefined) return (
            <div className={classes.navBar}>
                <div className={classes.logo} id="logo" onClick={ event => this.changePage('logo')}>
                    <img src ={icon2} alt = "logo" className={classes.logoImgText}/>
                </div>
            </div>
        );
        return (
            
                <div className={classes.navBar}>
                    <div className={classes.navLinkR} id="logLink" onClick={event => {this.changePage('logLink');}}>
                        Logg Ut
                    </div>
                    <div className={classes.logo} id="logo" onClick={ event => this.changePage('logo')}>
                        <img src ={icon} alt = "logo" className={classes.logoImg}/>
                    </div>
                    <div className={classes.activeLink} id="eventLink" onClick={event => { this.changePage('eventLink'); }} >
                        Mine Arrangement
                    </div>
                    <div className={classes.navLinkL} id="createLink" onClick={event => {this.changePage('createLink');}}>
                        Lage Arrangement
                    </div>
                    <div className={classes.navLinkL} id="profileLink" onClick={event => this.changePage('profileLink')}>
                        Min Profil
                    </div>
                </div>
        );
    }
    changePage(id) {
        if (document.getElementsByClassName('' + classes.activeLink + '') !== null) {
            if (document.getElementById(id) !== null) {
                //document.getElementsByClassName(classes.activeLink)[0].className = '' + classes.navLink + '';
                //document.getElementById(id).className ='' + classes.activeLink + '';

                switch (id) {
                    case 'profileLink':
                        history.push('/user/' + window.sessionStorage.getItem('user'));
                        break;
                    case 'createLink':
                        history.push('/registrerarrangement');
                        break;
                    case 'eventLink':
                        history.push('/arrangement');
                        break;
                    case 'logLink':
                        window.sessionStorage.removeItem('jwt');
                        window.sessionStorage.removeItem('user');
                        history.push('/');
                        break;
                    case 'logo':
                        if(window.sessionStorage.getItem('jwt') == undefined) history.push('/');
                        else history.push('/user/' + window.sessionStorage.getItem('user'));
                        break;
                    default :
                        console.log("error");
                }
            }
        }
    }
}
