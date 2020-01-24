import React, { Component } from 'react';
import classes from './ErrorComponent.module.scss';


export default class ErrorComponent extends Component {



    renderSwitch(param) {
        switch(param) {
          case 'http://localhost:3000/#/ErrorComponent/Login':
            return 'Wrong e-mail or password';
          case 'http://localhost:3000/#/ErrorComponent/ForgetPassword':
            return 'E-mail is not registered';
            default:
                return 'Noe gikk galt';
        }
      }


    render(){
        return (
            <div>
            <div className={classes.error}><span>Sorry : </span>{this.renderSwitch(window.location.href)}</div>
            </div>
            );
    };


}