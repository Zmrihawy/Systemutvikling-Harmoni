import React, { Component } from 'react';
import './Login.css';

import { createHashHistory } from 'history';
const history = createHashHistory();

export default class Registration extends Component {
    handleClick = e => {
        e.preventDefault();
        history.push('/');
    };

    render() {
        return (
            <div className="login-page">
                <div className="form">
                    <form className="register-form">
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <input type="text" placeholder="Firstname" />
                        <input type="text" placeholder="Secondname" />
                        <input type="email" placeholder="Email" />
                        <input type="text" placeholder="Phone" />
                        <label for="avatar">Choose a profile picture:</label>
                        <input type="file" accept="image/*" id="avatar" />
                        <button>create</button>
                        <p className="message">
                            Already registered?{' '}
                            <a onClick={this.handleClick}>Sign In</a>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
