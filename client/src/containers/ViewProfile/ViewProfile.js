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
    render(){
        return(
            <div className={classes.ViewProfile}>
                <Header id="HEADER">
                </Header>
                <div className={classes.showLayer}>
                    <div className={classes.row}>
                        <div className={classes.column}>
                            <h1>First name and Surname</h1>
                            <img src="https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg" alt="Profile picture"/>
                        </div>
                        <div className={classes.column}>
                            <h1>BIO</h1>
                            <b/>
                            <div className={classes.p}>Username</div>
                            <b/>
                            <div className={classes.p}>Email</div>
                            <b/>
                            <div className={classes.p}>Telephone number</div>
                            <div className={classes.editLayer}>
                                <div className="bio">
                                    <h4><b>Edit Info</b></h4>
                                    <div className={classes.row}>
                                        <div className={classes.column}>
                                            <input className={classes.input} type='text' placeholder="username"></input>
                                            <b/>
                                            <input className={classes.input} type='text' placeholder="password"></input>
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.column}>
                                            <input className={classes.input} type='text' placeholder="email"></input>
                                            <b/>
                                            <input className={classes.input} type='text' placeholder="telephone"></input>
                                        </div>
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
