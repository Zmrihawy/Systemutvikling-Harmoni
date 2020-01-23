import React, { Component } from 'react';
import '../Login/Login.scss';
import { User, userService } from '../../services.js';
import { history } from '../App';
import ShowPassword from '../Password/Password';


export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = new User();
        this.state.email = window.sessionStorage.getItem('email');
    }

    render() {
        return (
            <div className="loginBg">
            <div className="login-page">
                <div className="form">
                    <form className="register-form" onSubmit={this.register}>
                        <p id="error"></p>
                        <br />
                        <input type="text" required name="username" placeholder="Brukernavn" value={this.state.username} onChange={this.onChange} />
                        <ShowPassword id = {"pw1"}/>
                        <ShowPassword id = {"pw2"}/>
                        <input type="text" required name="firstName" placeholder="Fornavn" value={this.state.firstname} onChange={this.onChange}/>
                        <input type="text" required name="lastName" placeholder="Etternavn" value={this.state.surname} onChange={this.onChange}/>
                        <input
                            type="email" required name="email" placeholder="E-post" value={this.state.email} onChange={this.onChange}/>
                        <input type="text" required name="phone" placeholder="Phone" value={this.state.phone} onChange={this.onChange}/>
                        <div className="radioDiv" onChange={this.onChange}>
                        <label for="0">
                            <input type="radio" value="0" defaultChecked name="artist"/> 
                                 Arrangør </label><br></br>
                                 <label for="1">
                            <input type="radio" value="1" name="artist"/>
                                 Artist </label>
                        </div>
                        <br></br><br></br>

                        {/*<label for="avatar">Choose a profile picture:</label>
                <input type="file" accept="image/*" id="avatar" />*/}

                        <input className="Button" type="submit" value="Registrer"></input>
                        <p className="message">
                            Allerede registrert? <a href="#">Logg inn</a>
                        </p>
                    </form>
                </div>
            </div>
            </div>
        );
    }

    register = event => {
        event.preventDefault();

        if(document.querySelector("#pw2").value !== document.querySelector("#pw1").value) return document.querySelector('#error').innerHTML = "Passord-felter matcher ikke";

        userService
            .createUser(
                this.state.username,
                document.querySelector("#pw1").value,
                this.state.email,
                this.state.phone,
                this.state.firstName,
                this.state.lastName,
                this.state.artist
            )
            .then(() =>
                userService
                    .loginUser(document.querySelector("#pw1").value, this.state.email)
                    .then(() =>
                        history.push(
                            '/user/' + window.sessionStorage.getItem('user')
                        )
                    )
            )
            .then(() => {
                history.push('/user/' + window.sessionStorage.getItem('user'));
            })
            .catch(data => {

                let err = document.querySelector('#error');

                if (data.error === undefined)
                    return (err.innerHTML =
                        'Internal Server Error, please try again later.');
                if (data.error === 'mail and username')
                    return (err.innerHTML =
                        'Username and email is already in use.');
                if (data.error === 'mail')
                    return (err.innerHTML = 'Mail is already in use');
                if (data.error === 'username')
                    return (err.innerHTML = 'Username is already taken');
            });
    };

    onChange = event => {
        if (event.target.name === 'email')
            window.sessionStorage.setItem('email', event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    };
}
