import React, { Component } from 'react';
import classes from './ViewProfile.module.scss';
import { userService } from '../../services';
import profileHolder from '../../pictures/profileHolder.svg';
export default class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            username: null,
            email: null,
            phone: null,
            firstName: null,
            surname: null
        };
    }
    async componentDidMount() {
        var intId = parseInt(this.props.match.params.id, 10);
        const user = await userService.getUser(intId);
        this.setState(user);
        let picture = await userService.getPicture(intId)
            .then(picLink => (document.getElementById("profileImg").src = picLink))
        console.log(picture);
    }
    render() {
        return (
            <div className={classes.viewProfile}>
                <div className={classes.row}>
                        <div className={classes.column} id={'imageColumn'}>
                            <div className={classes.imgContainer} id={"imgContainer"}>
                                <img
                                    className={classes.profile}
                                    id={'profileImg'}
                                    src={profileHolder}
                                    alt="Profile picture"
                                />
                            </div>
                            <button
                                className={classes.redigerBtn} id={"redigerBtn"}
                            >
                                ✎
                            </button>
                        </div>
                            <div className={classes.bioLayer} id={"bioLayer"}>
                                <h1 className={classes.h1} id={'nameP'}>
                                    {'' +
                                        this.state.firstName +
                                        ' ' +
                                        this.state.surname +
                                        ''}
                                </h1>
                                <p>Artist</p>
                                <div className={classes.p} id={'emailP'}>
                                    {this.state.email}
                                </div>
                                <button className={classes.redigerBrukerBtn} id={"redigerBrukerBtn"} onClick={this.showEditForm}>Rediger bruker</button>
                            </div>
                            <div className={classes.editLayer} id={"editLayer"}>
                                <h4 className={classes.editHeader}>
                                    <b>Rediger Info</b>
                                </h4>
                                <div className={classes.row}>
                                    <div className={classes.column}>
                                        <div className={classes.editTitle}>
                                            Brukernavn
                                        </div>
                                        <input
                                            id={'nameInp'}
                                            className={classes.input}
                                            type="text"
                                            placeholder={this.state.username}
                                        />
                                        <b />
                                        <div className={classes.editTitle}>
                                            Epost
                                        </div>
                                        <input
                                            id={'emailInp'}
                                            className={classes.input}
                                            type="text"
                                            placeholder={this.state.email}
                                        />
                                        <div className={classes.editTitle}>
                                            Telefon
                                        </div>
                                        <input
                                            id={'telephoneInp'}
                                            className={classes.input}
                                            type="text"
                                            placeholder={this.state.phone}
                                        />
                                    </div>
                                    <div className={classes.column}>
                                        <div className={classes.editTitle}>
                                            Fornavn
                                        </div>
                                        <input
                                            id={'firstNameInp'}
                                            className={classes.input}
                                            type="text"
                                            placeholder={this.state.firstName}
                                        />
                                        <b />
                                        <div className={classes.editTitle}>
                                            Etternavn
                                        </div>
                                        <input
                                            id={'surnameInp'}
                                            className={classes.input}
                                            type="text"
                                            placeholder={this.state.surname}
                                        />
                                    </div>
                                    <div className={classes.column}>
                                        <h5 className={classes.editHeader}>
                                            <b>Endre Passord</b>
                                        </h5>
                                        <br/>
                                        <div className={classes.editTitle}>
                                            Gammel Passord
                                        </div>
                                        <input
                                            id={'oldPasswordInp'}
                                            className={classes.input}
                                            type="password"
                                        />
                                        <div className={classes.editTitle}>
                                            Nytt Passord
                                        </div>
                                        <input
                                            id={'passwordInp'}
                                            className={classes.input}
                                            type="password"
                                        />
                                        <div className={classes.editTitle}>
                                            Gjenta nytt passord
                                        </div>
                                        <input
                                            id={'repeatPasswordInp'}
                                            className={classes.input}
                                            type="password"
                                        />
                                    </div>
                                </div>
                                <div className={classes.row}>
                                    <button
                                        className={classes.button}
                                        onClick={event =>
                                            this.eventHandler()
                                        }
                                    >
                                        Lagre endringene
                                    </button>
                                </div>
                            </div>
                    </div>
            </div>
        );
    }
    eventHandler() {
        let newName = this.state.username;
        let newEmail = this.state.email;
        let newTelephone = this.state.phone;
        let newFirstName = this.state.firstName;
        let newSurname = this.state.surname;
        if (
            document.getElementById('nameInp') !== null &&
            document.getElementById('nameInp').value !== ''
        ) {
            newName = document.getElementById('nameInp').value;
        }
        if (
            document.getElementById('emailInp') !== null &&
            document.getElementById('emailInp').value !== ''
        ) {
            newEmail = document.getElementById('emailInp').value;
        }
        if (
            document.getElementById('telephoneInp') !== null &&
            document.getElementById('telephoneInp').value !== ''
        ) {
            newTelephone = document.getElementById('telephoneInp').value;
        }
        if (
            document.getElementById('firstNameInp') !== null &&
            document.getElementById('firstNameInp').value !== ''
        ) {
            newFirstName = document.getElementById('firstNameInp').value;
        }
        if (
            document.getElementById('surnameInp') !== null &&
            document.getElementById('surnameInp').value !== ''
        ) {
            newSurname = document.getElementById('surnameInp').value;
        }
        if (
            document.getElementById('passwordInp') !== null &&
            document.getElementById('passwordInp').value !== ''
        ) {
            if(document.getElementById('repeatPasswordInp') !== null &&
            document.getElementById('repeatPasswordInp').value === document.getElementById('passwordInp').value){
                if(document.getElementById('oldPasswordInp') !== null &&
                document.getElementById('oldPasswordInp').value !== ''){
                    if(this.checkUpdatePassword()){
                    }
                }
            }
        }
        this.setState(
            {
                username: newName,
                email: newEmail,
                phone: newTelephone,
                firstName: newFirstName,
                surname: newSurname
            },
            () => this.setUser()
        );
    }
    checkUpdatePassword(){
        let verified = true;
        userService.updatePassword(this.state.id,(document.getElementById("oldPasswordInp").value),(document.getElementById('passwordInp').value))
            .catch((error: Error) => verified = false);
        return verified;
    }
    setUser() {
        userService
            .updateUser(
                this.state.id,
                this.state.username,
                this.state.email,
                this.state.phone,
                this.state.firstName,
                this.state.surname
            )
            .catch((error: Error) => console.log(error.message));
        if(document.getElementById("editLayer") !== null){
            document.getElementById("editLayer").style.visibility = 'hidden';
            document.getElementById("editLayer").style.pointerEvents = 'none';
        }
        if(document.getElementById("redigerBrukerBtn") !== null){
            document.getElementById("redigerBrukerBtn").style.visibility = 'visible';
            document.getElementById("redigerBrukerBtn").style.pointerEvents = 'all' +
                '';
        }
        document.getElementById('oldPasswordInp').value = '';
        document.getElementById('repeatPasswordInp').value = '';
        document.getElementById('passwordInp').value = '';

        if(document.getElementById("imgContainer") !== null && document.getElementById("redigerBtn") !==
            null && document.getElementById("bioLayer") !== null) {
            if(window.innerWidth >= 1000){
                document.getElementById("imgContainer").style.left = "calc(50% - 11vw)";
                document.getElementById("bioLayer").style.left = "calc(50% - 12vw)";
                document.getElementById("redigerBtn").style.left = "calc(50% - 120px)";
            }
        }

    }

    showEditForm() {
        if(document.getElementById("imgContainer") !== null && document.getElementById("redigerBtn") !==
        null && document.getElementById("bioLayer") !== null) {
            if(window.innerWidth >= 1000){
                document.getElementById("imgContainer").style.left = "10%";
                document.getElementById("bioLayer").style.left = "10%";
                document.getElementById("redigerBtn").style.left = "calc(10% + 30px)";
            }
            else{
                console.log("change");
                if(document.getElementById("editLayer") !== null){
                    document.getElementById("editLayer").innerHTML =
                        '<h4 className={classes.editHeader}>\n' +
                            '<b>Rediger Info</b>\n' +
                        '</h4>' +
                        '<div className={classes.editTitle}>\n' +
                            ' Brukernavn\n' +
                        '</div>\n' +
                        '<input\n' +
                            'id={\'nameInp\'}\n' +
                            'className={\classes.input\}\n' +
                            'type="text"\n' +
                        '/>' +
                        '<div className={classes.editTitle}>\n' +
                            'Epost\n' +
                        '</div>\n' +
                        '<input\n' +
                            'id={\'emailInp\'}\n' +
                            'className={classes.input}\n' +
                            'type="text"\n' +
                        '/>'

                }
            }
        }
        if(document.getElementById("editLayer") !== null){
            document.getElementById("editLayer").style.visibility = 'visible';
            document.getElementById("editLayer").style.pointerEvents = 'all';
        }
        if(document.getElementById("redigerBrukerBtn") !== null){
            document.getElementById("redigerBrukerBtn").style.visibility = 'hidden';
            document.getElementById("redigerBrukerBtn").style.pointerEvents = 'none';

        }
    }
}
