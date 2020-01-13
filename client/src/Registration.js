import React, { Component } from "react";
import './Login.css'; 
export default class Registration extends Component {

    render() {


        
        return (
            <div className="login-page">
            <div className="form">
              <form className="register-form">
                <input type="text" placeholder="Username"/>
                <input type="password" placeholder="password"/>
                <input type="text" placeholder="Firstname"/>
                <input type="text" placeholder="Secondname"/>
                <input type="email" placeholder="Email"/>
                <input type="text" placeholder="Phone"/>
                <label for="avatar">Choose a profile picture:</label>
                <input type="file" accept="image/*" id="avatar" />
                <button>create</button>
                <p className="message">Already registered? <a href="#">Sign In</a></p>
              </form>
              
            </div>
          </div>
        );
    }


}