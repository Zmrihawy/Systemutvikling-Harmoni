import React, {Component} from 'react';
import classes from './ViewProfile.module.scss';
import NavBar from "../../components/NavBar/NavBar";
import {User,userService} from "../../services";

export default class ViewProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            id: 1,
            username: null,
            email: null,
            phone: null,
            firstName: null,
            surname: null
        };
    }
    componentDidMount() {
       userService.getUser(this.state.id)
           .then(userData => {
                this.setState(userData);
            })
            .catch((error: Error) => console.log(error));
    }
    render(){
        return(
            <div className={classes.viewProfile}>
                <div className={classes.showLayer}>
                    <div className={classes.row}>
                        <div className={classes.column}>
                            <div className={classes.imgContainer}>
                                <img className={classes.profile} src="https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg" alt="Profile picture"/>
                                <div className={classes.overlay}>
                                    <a href="#" className={classes.icon} title="User Profile">
                                        <i className={classes.fadeUser}></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={classes.column}>
                            <div className={classes.bioLayer}>
                                <h1 className={classes.h1} id={"nameP"}>{"" + this.state.firstName + " " + this.state.surname + ""}</h1>
                                <b/>
                                <div className={classes.p} id={"usernameP"}>Brukernavn: {this.state.username}</div>
                                <b/>
                                <div className={classes.p} id={"emailP"}>Epost: {this.state.email}</div>
                                <b/>
                                <div className={classes.p} id={"telephoneP"}>Telefonnummer: {this.state.phone}</div>
                            </div>
                            <div className={classes.editLayer}>
                                <h4><b>Rediger Info</b></h4>
                                <div className={classes.row}>
                                    <div className={classes.column}>
                                        <input id={"nameInp"} className={classes.input} type='text' placeholder="brukernavn"/>
                                        <b/>
                                        <input id={"emailInp"} className={classes.input} type='text' placeholder="epost"/>
                                        <b/>
                                        <input id={"telephoneInp"} className={classes.input} type='text' placeholder="telefon"/>
                                    </div>
                                    <div className={classes.column}>
                                        <input id={"passwordInp"} className={classes.input} type='password' placeholder="passord"/>
                                        <b/>
                                        <button className={classes.button} onClick={event => (this.eventHandler())}>
                                            ✓
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    eventHandler(){
        let newName = this.state.username;
        let newEmail = this.state.email;
        let newTelephone = this.state.phone;
        if((document.getElementById('nameInp') !== null) &&
            (document.getElementById('nameInp').value !== '')){
            newName = document.getElementById('nameInp').value;
        }
        if((document.getElementById('emailInp') !== null) &&
            (document.getElementById('emailInp').value !== '')){
            newEmail = document.getElementById('emailInp').value;
        }
        if((document.getElementById('telephoneInp') !== null) &&
            (document.getElementById('telephoneInp').value !== '')){
            newTelephone = document.getElementById('telephoneInp').value;
        }
        this.setState({
            username: newName,
            email: newEmail,
            phone: newTelephone
        }, () => this.setUser());
    }
    setUser(){
        console.log(this.state.username);
        userService.updateUser(this.state.id,this.state.username,this.state.email,this.state.phone,this.state.firstName,this.state.surname)
            .catch((error: Error) => console.log(error.message));
    }
}
