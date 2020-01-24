import React, { Component } from 'react';
import TypeIt from 'typeit';

export default class Type extends Component {
    componentDidMount() {
        new TypeIt(this.el, this.props).go();
    }

    render() {
        return (
            <span
                ref={el => {
                    this.el = el;
                }}
            >
                {this.props.children}
            </span>
        );
    }
}
