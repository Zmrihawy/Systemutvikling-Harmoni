import React, { Component } from 'react';
import '../Login/Login.scss';
import { User, userService } from '../../services.js';
import { history } from '../App';
import ShowPassword from '../Password/Password';

/*
const validatedEmailRegex = /\S+@\S+\.\S+/;
const regUserName = /^[\s0-9a-zæøåA-ZÆØÅ]+$/;
const regName = /^[a-zæøåA-ZÆØÅ]*$/;
const regPhone = /^[+0-9]*$/;
*/

const validateForm = errors => {
    let valid = true;
    Object.values(errors).forEach(val => val.length > 0 && (valid = false));
    return valid;
};

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
                        <input
                            type="text"
                            required
                            name="username"
                            placeholder="Brukernavn"
                            value={this.state.username}
                            onChange={this.onChange}
                        />
                        <ShowPassword id = {"pw1"}/>
                        <ShowPassword id = {"pw2"}/>
                        <input
                            type="text"
                            required
                            name="firstName"
                            placeholder="Fornavn"
                            value={this.state.firstname}
                            onChange={this.onChange}
                        />
                        <input
                            type="text"
                            required
                            name="lastName"
                            placeholder="Etternavn"
                            value={this.state.surname}
                            onChange={this.onChange}
                        />
                        <input
                            type="email"
                            required
                            name="email"
                            placeholder="E-post"
                            value={this.state.email}
                            onChange={this.onChange}
                        />

                        <input
                            type="text"
                            required
                            name="phone"
                            placeholder="Phone"
                            value={this.state.phone}
                            onChange={this.onChange}
                        />
                        <label>
                            <input
                                type="radio"
                                name="artist"
                                value="0"
                                onChange={this.onChange}
                            />
                            <a>Arrangør</a>
                            <input
                                type="radio"
                                name="artist"
                                value="1"
                                onChange={this.onChange}
                            />
                            <a>Artist</a>
                        </label>

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

        console.log(document.querySelector("#pw1"));
        console.log(document.querySelector("#pw2"));

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
                console.log('Token:');
                console.log(window.sessionStorage.getItem('user'));
                history.push('/user/' + window.sessionStorage.getItem('user'));
            })
            .catch(data => {
                console.log(data);

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
