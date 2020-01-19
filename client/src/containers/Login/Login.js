import React, { Component } from 'react';
import './Login.css';
import { User, userService } from '../../services';
import { history } from '../App';
import ShowPassword from '../Password/Password'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = new User();
        this.state.email = window.sessionStorage.getItem('email');
    }

    render() {
        return (
            <div className="login-page">
                <div className="form" onSubmit={this.login}>
                    <form className="login-form" onSubmit={this.login}>
                    <p id = "error"></p><br/>
                        <input type="email" required name="email" value={this.state.email} placeholder="E-post" onChange={this.onChange} />
                        <ShowPassword parent={this} />
                        <input type="submit" value="Logg inn"></input>
                        <p className="message">
                            Ikke registrert?{' '}
                            <a onClick={this.handleClick}>Lag en bruker</a>
                        </p>
                        <p className="message">
                        <a onClick={this.glemt} > Glemt Passord? </a></p>
                    </form>
                </div>
            </div>
        );
    }

    glemt(){
        history.push('/glemt');
    }

    handleClick() {
        history.push('/registrer');
    }

    onChange = event => {

        if(event.target.name === 'email') window.sessionStorage.setItem('email', event.target.value);
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    login = event => {
        event.preventDefault();

        userService
            .loginUser(this.state.password, this.state.email)
            .then(data => console.log(data))
            .then(none => {
              history.push('/user/' + window.sessionStorage.getItem('user'));
            })
            .catch(data => {
                document.querySelector("#error").innerHTML = 'Wrong e-mail or password';
            });
    };
}
