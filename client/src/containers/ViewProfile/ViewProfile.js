import React, {Component} from 'react';
import classes from './ViewProfile.module.scss';
import NavBar from "../../components/NavBar/NavBar";

export default class ViewProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: null,
            password: null,
            email: null,
            telephone: null
        };
    }
    setAttribute(attribute,value){
        console.log(value);
        if("" + attribute + "" === "username"){
            this.setState({username: value});
            document.getElementById('usernameP').innerHTML = "Username: " + value;
        }
        else if("" + attribute + "" === "email"){
            this.setState({email: value});
            document.getElementById('emailP').innerHTML = "Email: " + value;

        }
        else if("" + attribute + "" === "telephone"){
            this.setState({telephone: value});
            document.getElementById('telephoneP').innerHTML = "Telephone: " + value;

        }
    }
    render(){
        return(
            <div className={classes.viewProfile}>
                <NavBar></NavBar>
                <div className={classes.showLayer}>
                    <div className={classes.row}>
                        <div className={classes.column}>
                            <div className={classes.imgContainer}>
                                <img className={classes.profile} src="https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg" alt="Profile picture"/>
                                <div className={classes.overlay}>
                                    <a href="#" className={classes.icon} title="User Profile">
                                        <i className={classes.fadeUser}></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className={classes.column}>
                            <div className={classes.bioLayer}>
                                <h1 className={classes.h1}>Navn og Etternavn</h1>
                                <b/>
                                <div className={classes.p} id={"usernameP"}>Brukernavn: ????</div>
                                <b/>
                                <div className={classes.p} id={"emailP"}>Epost: ?????</div>
                                <b/>
                                <div className={classes.p} id={"telephoneP"}>Telefonnummer: ????</div>
                            </div>
                            <div className={classes.editLayer}>
                                <h4><b>Rediger Info</b></h4>
                                <div className={classes.row}>
                                    <div className={classes.column}>
                                        <input id={"nameInp"} className={classes.input} type='text' placeholder="brukernavn"/>
                                        <b/>
                                        <input id={"emailInp"} className={classes.input} type='text' placeholder="epost"/>
                                        <b/>
                                        <input id={"telephoneInp"} className={classes.input} type='text' placeholder="telefon"/>
                                    </div>
                                    <div className={classes.column}>
                                        <input id={"passwordInp"} className={classes.input} type='password' placeholder="passord"/>
                                        <b/>
                                        <button className={classes.button} onClick={event => (this.eventHandler())}>
                                            ✓
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    eventHandler(){
        if(document.getElementById('nameInp') !== null){
            let newName = document.getElementById('nameInp').value;
            if(newName != null && newName != ''){
                this.setAttribute("username",newName);
            }
        }
        if(document.getElementById('emailInp') !== null){
            let newEmail = document.getElementById('emailInp').value;
            if(newEmail != null && newEmail != ''){
                this.setAttribute("email",newEmail);
            }
        }
        if(document.getElementById('telephoneInp') !== null){
            let newTelephone = document.getElementById('telephoneInp').value;
            if(newTelephone !== null && newTelephone !== ''){
                this.setAttribute('telephone',newTelephone);
            }
        }
    }
}
