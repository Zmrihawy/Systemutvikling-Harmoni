import React, { Component } from 'react';
import '../Login/Login.scss';
import { User, userService } from '../../services';
import { history } from '../App';
export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : window.sessionStorage.getItem('email')
        }
    }

    render() {
        return (
            <div className ="loginBg">
            <div className="login-page">
                <div className="form" onSubmit={this.newPw}>
                    <form className="login-form" onSubmit={this.login}>
                    <p id = "error"></p><br/>
                        <input type="email" required name="email" value={this.state.email} placeholder="E-post" onChange={this.onChange} onLoad={() => this.state.email = window.localStorage.getItem('email')} />
                        <input type="submit" className = "Button" value="Send Passord"></input>
                        <p className="message">
                            Ikke registrert?{' '}
                            <a onClick={() => history.push('/registrer')}>Lag en bruker</a>
                        </p>
                        <p className="message">
                            <a href="#">Logg inn</a>
                        </p>
                    </form>
                </div>
            </div>
            </div>
        );
    }

    klikk(){

    }

    onChange = event => {
        if(event.target.name === 'email') window.sessionStorage.setItem('email', event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    newPw = event => {
        event.preventDefault();

        userService
            .forgotPassword(this.state.email)
            .then(() => history.push('/login'))
            .catch(data => {
                document.querySelector("#error").innerHTML = 'E-mail ikke registrert';
            });
    };
}