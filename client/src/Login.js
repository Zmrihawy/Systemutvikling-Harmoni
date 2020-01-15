import React, { Component } from 'react';
import './Login.css';

import { createHashHistory } from 'history';
const history = createHashHistory();

export default class Login extends Component {
    handleClick = e => {
        e.preventDefault();
        history.push('/registrer');
    };

    render() {
        return (
            <div className="login-page">
                <div className="form">
                    <form className="login-form">
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button>login</button>
                        <p className="message">
                            Not registered?{' '}
                            <a onClick={this.handleClick}>Create an account</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
