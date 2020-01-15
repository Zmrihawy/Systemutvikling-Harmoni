import React, { Component } from "react";
import '../Login/Login.css'; 
import {User, userService} from "../../services.js";

/*
const validatedEmailRegex = /\S+@\S+\.\S+/;
const regUserName = /^[\s0-9a-zæøåA-ZÆØÅ]+$/;
const regName = /^[a-zæøåA-ZÆØÅ]*$/;
const regPhone = /^[+0-9]*$/;
*/


const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

export default class Registration extends Component {

  constructor(props){
    super(props);
    this.state = new User();
  }

    render() {
        return (
            <div className="login-page">
            <div className="form">
              <form className="register-form" onSubmit={this.register}>
                <input type="text" required name ="username" placeholder="Username" value = {this.state.username} onChange = {this.onChange}/>
                <input type="password" required name="password" placeholder="Password" value = {this.state.password} onChange = {this.onChange}/>
                <input type="text" required name="firstName" placeholder="Firstname" value = {this.state.firstname} onChange = {this.onChange}/>
                <input type="text" required name="lastName" placeholder="Surname" value = {this.state.surname} onChange = {this.onChange}/>
                <input type="email" required name="email" placeholder="Email" value = {this.state.email} onChange = {this.onChange}/>
                <input type="text" required name="phone" placeholder="Phone" value = {this.state.phone} onChange = {this.onChange}/>
                {/*<label for="avatar">Choose a profile picture:</label>
                <input type="file" accept="image/*" id="avatar" />*/}
                <input type="submit" value="Create"></input>
                <p className="message">Already registered? <a href="#">Sign In</a></p>
              </form>
            </div>
          </div>
        );
    }

    register = (event) => {
      event.preventDefault();
      
      userService.createUser(
        this.state.username,
        this.state.password,
        this.state.email,
        this.state.phone, 
        this.state.firstName,
        this.state.lastName
      )
      .then(() => userService.loginUser(this.state.username, this.state.password, this.state.email))
      .catch(data => {
        
        let s = data.sqlMessage.slice(data.sqlMessage.indexOf('key'));

        console.log(s);

        s = s.split("'").join("").replace("key","").trim();

        console.log(s);
        
        
        if(s === 'username'){
          console.log("brukernavn i bruk");
        } else {
          console.log("mail i bruk");
        }
        
      });

    }

    onChange = (event) => {
      this.setState({
        [event.target.name] : event.target.value
      })
    }
}