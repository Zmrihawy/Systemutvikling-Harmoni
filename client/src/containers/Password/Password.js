import React, { Component } from 'react';
import './password.scss';

import zxcvbn from 'zxcvbn';

export default class ShowPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'password',
            score: 'null'
        };
        this.showHide = this.showHide.bind(this);
        this.passwordStrength = this.passwordStrength.bind(this);
    }

    showHide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            type: this.state.type === 'input' ? 'password' : 'input'
        });
    }

    passwordStrength(e) {
        if (e.target.value === '') {
            this.setState({
                score: 'null'
            });
        } else {
            var pw = zxcvbn(e.target.value);
            this.setState({
                score: pw.score
            });
        }
    }

    render() {
        if (this.props.strength === true) {
            return (
                <label className="password">
                    <input
                        type={this.state.type}
                        id={this.props.id}
                        placeholder="Passord"
                        className="password__input"
                        onChange={this.passwordStrength}
                    />
                    <span className="password__show" onClick={this.showHide}>
                        {this.state.type === 'input' ? 'Hide' : 'Show'}
                    </span>
                    <span
                        className="password__strength"
                        data-score={this.state.score}
                    />
                </label>
            );
        } else
            return (
                <label className="password">
                    <input
                        type={this.state.type}
                        id={this.props.id}
                        placeholder="Passord"
                        className="password__input"
                        onChange={this.passwordStrength}
                    />
                    <span className="password__show" onClick={this.showHide}>
                        {this.state.type === 'input' ? 'Hide' : 'Show'}
                    </span>
                </label>
            );
    }
}

//ReactDOM.render(<ShowPassword/>, document.getElementById('react'));
