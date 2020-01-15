import React, { Component } from "react";
import './Login.css'; 
import { User, userService } from "../../services";
export default class Login extends Component {

  constructor(props){
    super(props);
    this.state = new User();
  }

    render() {


        
        return (
            <div className="login-page">
            <div className="form" onSubmit = {this.login}>   
              <form className="login-form" onSubmit={this.login}>
                <p>Error</p>
                <input type="email" required name="email" value={this.state.email} placeholder="Email" onChange={this.onChange}/>
                <input type="password" required name="password" value={this.state.username} placeholder="Password" onChange={this.onChange}/>
                <input type = "submit" value="Login"></input>
                <p className="message">Not registered? <a onClick={this.handleClick} href="#">Create an account</a></p>
              </form>
            </div>
          </div>
        );
      }

      onChange = (event) => {
        this.setState({
          [event.target.name] : event.target.value
        })
      }

      login = (event) => {
        event.preventDefault();

        userService.loginUser(this.state.password, this.state.email)
        .then(data => console.log(data))
        .catch(data => {
          console.log(data)
        })

      }
}