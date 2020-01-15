import React, { Component } from 'react';
import './Login.css';
export default class Login extends Component {
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
                                <a onClick={this.handleClick} href="#">
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
