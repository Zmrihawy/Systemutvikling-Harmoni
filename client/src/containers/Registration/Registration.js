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
                        <ShowPassword />
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

                        <input type="submit" value="Registrer"></input>
                        <p className="message">
                            Allerede registrert? <a href="#">Logg inn</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    register = event => {
        event.preventDefault();

        let passwordData;

        if (
            document.getElementById('pw') !== null &&
            document.getElementById('pw').value !== ''
        ) {
            passwordData = document.getElementById('pw').value;
            this.setState({
                password: passwordData
            });
            console.log(passwordData);
        }

        userService
            .createUser(
                this.state.username,
                passwordData,
                this.state.email,
                this.state.phone,
                this.state.firstName,
                this.state.lastName
            )
            .then(() =>
                userService
                    .loginUser(this.state.password, this.state.email)
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
