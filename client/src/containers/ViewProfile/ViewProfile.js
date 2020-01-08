import React, {Component} from 'react';
import Header from '../../components/Header/Header';
import classes from './ViewProfile.module.scss';

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
            document.getElementById('usernameP').innerHTML = value;
        }
        else if("" + attribute + "" === "email"){
            this.setState({email: value});
            document.getElementById('emailP').innerHTML = value;

        }
        else if("" + attribute + "" === "telephone"){
            this.setState({telephone: value});
            document.getElementById('telephoneP').innerHTML = value;

        }
    }
    render(){
        return(
            <div className={classes.viewProfile}>
                <Header>
                </Header>
                <div className={classes.showLayer}>
                    <div className={classes.row}>
                        <div className={classes.column}>
                            <h1>First name and Surname</h1>
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
                                <h1>BIO</h1>
                                <b/>
                                <div className={classes.p} id={"usernameP"}>Username</div>
                                <b/>
                                <div className={classes.p} id={"emailP"}>Email</div>
                                <b/>
                                <div className={classes.p} id={"telephoneP"}>Telephone number</div>
                            </div>
                            <div className={classes.editLayer}>
                                <h4><b>Edit Info</b></h4>
                                <div className={classes.row}>
                                    <div className={classes.column}>
                                        <input id={"nameInp"} className={classes.input} type='text' placeholder="username"/>
                                        <b/>
                                        <input id={"passwordInp"} className={classes.input} type='text' placeholder="password"/>
                                        <b/>
                                        <input id={"emailInp"} className={classes.input} type='text' placeholder="email"/>
                                        <b/>
                                        <input id={"telephoneInp"} className={classes.input} type='text' placeholder="telephone"/>
                                    </div>
                                    <div className={classes.column}>
                                        <button onClick={event => (this.eventHandler())}>
                                            Send
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
        if(document.getElementById('nameInp') != null){
            let newName = document.getElementById('nameInp').value;
            if(newName != null && newName != ''){
                this.setAttribute("username",newName);
            }
        }
        if(document.getElementById('emailInp') != null){
            let newEmail = document.getElementById('emailInp').value;
            if(newEmail != null && newEmail != ''){
                this.setAttribute("email",newEmail);
            }
        }
        if(document.getElementById('telephoneInp') != null){
            let newTelephone = document.getElementById('telephoneInp').value;
            if(newTelephone != null && newTelephone != ''){
                this.setAttribute('telephone',newTelephone);
            }
        }
    }
}
