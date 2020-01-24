import React, { Component } from 'react';
import classes from './NavBar.module.scss';

import { history } from '../../containers/App';

import icon from '../../pictures/icon4.png';
import icon2 from '../../pictures/icon3.png';

import meny from '../../pictures/menu.png';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { height: 512, show : false};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight});
    }

    setDisplay(){
        if(this.state.hidden) return classes.menuContainerHidden;
        return classes.menuContainerDisplay;
    }

    show(e){
        e.preventDefault();
        this.setState({ show : true }, () => {
            document.addEventListener('click', this.close);
          });
    }
    
    close(e){
        e.preventDefault();
        this.setState({ show : false }, () => {
            document.removeEventListener('click', this.close);
          });
    }


    render() {
        if(window.sessionStorage.getItem('jwt') == undefined || window.sessionStorage.getItem('jwt') === '') return (
            <div className={classes.navBar}>
                <div className={classes.logo} id="logo" onClick={ event => this.changePage('logo')}>
                    <img src ={icon2} alt = "logo" className={classes.logoImgText}/>
                </div>
            </div>
        );

        if(window.sessionStorage.getItem('artist') == 1){
            if(this.state.width/this.state.height < 1 || this.state.width < 750)
            return(
            <>
                <div className={classes.navBar}>
                <div className={classes.mobilNavLinkR} id="logLink" onClick={event => {this.changePage('logLink');}}>
                        Logg Ut
                    </div>

                    <div className={classes.mobilNavLinkL} onClick={this.show}>
                        <img src={meny} className={classes.mobileMenu}/>
                    </div>                    
                </div>
                {this.state.show ? (
                    <div className={classes.mobilNavLink}>
                        <div className={classes.mobilNavLink} id="profileLink" onClick={event => this.changePage('profileLink')}>
                            Min Profil
                        </div>
                        <div className={classes.mobilNavLink} id="eventLink" onClick={event => { this.changePage('eventLink'); }} >
                            Mine Arrangement
                        </div>
                    </div>
                    ) : (null) }
            </>);
            else return (
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
                    <div className={classes.navLinkL} id="profileLink" onClick={event => this.changePage('profileLink')}>
                        Min Profil
                    </div>
                </div>
        );
        }
        
        if(this.state.width/this.state.height < 1)
            return(
            <>
                <div className={classes.navBar}>
                <div className={classes.mobilNavLinkR} id="logLink" onClick={event => {this.changePage('logLink');}}>
                        Logg Ut
                    </div>

                    <div className={classes.mobilNavLinkL} onClick={this.show}>
                        <img src={meny} className={classes.mobileMenu}/>
                    </div>                    
                </div>
                {this.state.show ? (
                    <div className={classes.mobilNavLink}>
                        <div className={classes.mobilNavLink} id="profileLink" onClick={event => this.changePage('profileLink')}>
                            Min Profil
                        </div>
                        <div className={classes.mobilNavLink} id="eventLink" onClick={event => { this.changePage('eventLink'); }} >
                            Mine Arrangement
                        </div>
                        <div className={classes.mobilNavLink} id="createLink" onClick={event => {this.changePage('createLink');}}>
                            Lage Arrangement
                        </div>
                         
                    </div>
                    ) : (null) }
            </>)

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
