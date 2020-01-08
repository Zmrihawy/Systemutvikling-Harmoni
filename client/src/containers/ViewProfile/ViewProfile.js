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
        if("" + attribute + "" === "username"){
            this.setState({username: value});
            document.getElementById("usernameP").value = value;
        }
        else if("" + attribute + "" === "email"){
            this.setState({email: value});
            document.getElementById("emailP").value = value;

        }
        else if("" + attribute + "" === "telephone"){
            this.setState({telephone: value});
            document.getElementById("telephoneP").value = value;

        }
    }
    render(){
        return(
            <div className={classes.viewProfile}>
                <Header id="HEADER">
                </Header>
                <div className={classes.showLayer}>
                    <div className={classes.row}>
                        <div className={classes.column}>
                            <h1>First name and Surname</h1>
                            <img className={classes.profile} src="https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg" alt="Profile picture"/>
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
                                        <input className={classes.input} type='text' placeholder="username"></input>
                                        <b/>
                                        <input className={classes.input} type='text' placeholder="password"></input>
                                        <b/>
                                        <input className={classes.input} type='text' placeholder="email"></input>
                                        <b/>
                                        <input className={classes.input} type='text' placeholder="telephone"></input>
                                    </div>
                                    <div className={classes.column}>
                                        <input type={'submit'}></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
