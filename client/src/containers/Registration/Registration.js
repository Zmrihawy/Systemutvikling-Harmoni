import React, { Component } from 'react';
import '../Login/Login.scss';
import { User, userService } from '../../services.js';
import { history } from '../App';
import ShowPassword from '../Password/Password';
import { RadioButton, RadioGroup } from 'react-radio-buttons';


export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = new User();
        this.state.email = window.sessionStorage.getItem('email');
        this.state.artist = undefined;
        this.setArtist = this.setArtist.bind(this);
    }

    render() {
        return (
            <div className="loginBg">
            <div className="login-page">
                <div className="form">
                    <form className="register-form" onSubmit={this.register}>
                        <p id="error"></p>
                        <br />
                        <input type="text" required name="username" placeholder="Brukernavn" value={this.state.username} onChange={this.onChange} />
                        <ShowPassword id = {"pw1"} strength={true}/>
                        <ShowPassword id = {"pw2"} strength={true}/>
                        <input type="text" required name="firstName" placeholder="Fornavn" value={this.state.firstname} onChange={this.onChange}/>
                        <input type="text" required name="lastName" placeholder="Etternavn" value={this.state.surname} onChange={this.onChange}/>
                        <input
                            type="email" required name="email" placeholder="E-post" value={this.state.email} onChange={this.onChange}/>
                        <input type="text" required name="phone" placeholder="Telefon" value={this.state.phone} onChange={this.onChange}/>
                        {/*<div className="radioDiv">
                        <label for="0">
                            <input type="radio" value="0"  onChange={this.onChange} name="artist"/> 
                                 Arrangør </label><br></br>
                                 <label for="1">
                            <input type="radio" value="1" onChange={this.onChange} name="artist"/>
                                 Artist </label>
        </div>*/}
                 
                                    
                    <RadioGroup onChange={ this.setArtist } horizontal>
                        <RadioButton value="0">
                            <a className="knapptekst">Arrangør</a>
                        </RadioButton>
                        <RadioButton value="1">
                            <a className="knapptekst">Artist</a>
                        </RadioButton>
                    </RadioGroup>
                    
                 
                 
                 
                        <br></br><br></br>

                        {/*<label for="avatar">Choose a profile picture:</label>
                <input type="file" accept="image/*" id="avatar" />*/}


                        <input className="Button" type="submit" value="Registrer"></input>
                        <p className="message">
                            Allerede registrert? <a href="#">Logg inn</a>
                        </p>
                    </form>
                </div>
            </div>
            </div>
        );
    }

    setArtist(e){
        this.setState({
            artist : e
        })
    }

    register = event => {
        event.preventDefault();

        if(document.querySelector("#pw2").value !== document.querySelector("#pw1").value) return document.querySelector('#error').innerHTML = "Passord-felter matcher ikke";

        console.log(this.state.artist);

        if(this.state.artist === undefined) return document.querySelector('#error').innerHTML = "Velg brukertype";

        userService
            .createUser(
                this.state.username,
                document.querySelector("#pw1").value,
                this.state.email,
                this.state.phone,
                this.state.firstName,
                this.state.lastName,
                this.state.artist
            )
            .then(() =>
                userService
                    .loginUser(document.querySelector("#pw1").value, this.state.email)
                    .then(() =>{
                        window.sessionStorage.removeItem("email");
                        history.push('/user/' + window.sessionStorage.getItem('user'));
                    }))
            .then(() => {
                history.push('/user/' + window.sessionStorage.getItem('user'));
            })
            .catch(data => {

                let err = document.querySelector('#error');

                if (data.error === undefined)
                    return (err.innerHTML =
                        'Internal Server Error, prøv igjen senere.');
                if (data.error === 'mail and username')
                    return (err.innerHTML =
                        'Brukernavn og email er allerede i bruk.');
                if (data.error === 'mail')
                    return (err.innerHTML = 'E-mail er allerede i bruk');
                if (data.error === 'username')
                    return (err.innerHTML = 'Brukernavn er allerede tatt');
            });
    };

    onChange = event => {
        if (event.target.name === 'email') window.sessionStorage.setItem('email', event.target.value);
        if(event.target.name === "artist") this.setState({artist : event.target.value});
        else this.setState({
            [event.target.name]: event.target.value
        });
    };
}
