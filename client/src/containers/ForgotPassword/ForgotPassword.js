import React, { Component } from 'react';
import '../Login/Login.css';
import { User, userService } from '../../services';
import { history } from '../App';
export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = new User();
    }

    render() {
        return (
            <div className="login-page">
                <div className="form" onSubmit={this.login}>
                    <form className="login-form" onSubmit={this.login}>
                    <p id = "error"></p><br/>
                        <input type="email" required name="email" value={this.state.email} placeholder="E-post" onChange={this.onChange} />
                        <input type="submit" value="Send Passord"></input>
                        <p className="message">
                            Ikke registrert?{' '}
                            <a onClick={() => history.push('/registrer')}>Lag en bruker</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }

    klikk(){

    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    login = event => {
        event.preventDefault();

        userService
            .forgotPassword(this.state.email)
            .then(none => {
              history.push('/');
            })
            .catch(data => {
                console.log(data);
                document.querySelector("#error").innerHTML = 'E-mail ikke registrert';
            });
    };
}




