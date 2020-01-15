import React, { Component } from 'react';
import './Login.css';

import { history } from './containers/App'

export default class Login extends Component {
    handleClick = (e) => {
        e.preventDefault(); 
        history.push('/registrer');
    }

    render() {
        return (
            <div className="login-container">
                <div className="login-page">
                    <div className="form">
                        <form className="login-form">
                            <input type="text" placeholder="username" />
                            <input type="password" placeholder="password" />
                            <button>login</button>
                            <p className="message">
                                Not registered?{' '}
                                <a onClick={this.handleClick}>
                                    Create an account
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
