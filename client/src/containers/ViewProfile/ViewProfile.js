import React, { Component } from 'react';
import classes from './ViewProfile.module.scss';
import { userService } from '../../services';
import profileHolder from '../../pictures/profileHolder.svg';
import profileBackground from '../../pictures/profileBackground.svg';
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
    }
    render() {
        return (
            <div className={classes.viewProfile}>
                    <div className={classes.row}>
                        <div className={classes.column} id={'imageColumn'}>
                            <div className={classes.imgContainer}>
                                <img
                                    className={classes.profile}
                                    id={'profileImg'}
                                    src={profileHolder}
                                    alt="Profile picture"
                                />
                            </div>
                            <button
                                className={classes.redigerBtn} id={"redigerBtn"}
                                onClick={this.showImageForm}
                            >
                                ✎
                            </button>
                            <div
                                className={classes.imageForm}
                                id={'imageFormId'}
                            >
                                    <div className={classes.column}>
                                        <label id={'imgLabel'}>
                                            <b>Skrive inn link</b>
                                        </label>
                                        <input
                                            type="text"
                                            id="imgInput"
                                            placeholder="eks: 123bilde.jpg"
                                        />
                                        <button
                                            type="submit"
                                            className={classes.imgBtn}
                                            id={'imgBtn'}
                                            onClick={this.changePic}
                                        >
                                            ✓
                                        </button>
                                    </div>
                            </div>
                        </div>
                        <div className={classes.column}>
                            <div className={classes.bioLayer}>
                                <h1 className={classes.h1} id={'nameP'}>
                                    {'' +
                                        this.state.firstName +
                                        ' ' +
                                        this.state.surname +
                                        ''}
                                </h1>
                                <b />
                                <div className={classes.p} id={'usernameP'}>
                                    Brukernavn: {this.state.username}
                                </div>
                                <b />
                                <div className={classes.p} id={'emailP'}>
                                    Epost: {this.state.email}
                                </div>
                                <b />
                                <div className={classes.p} id={'telephoneP'}>
                                    Telefonnummer: {this.state.phone}
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
                                </div>
                                <div className={classes.row}>
                                    <h5 className={classes.editHeader}>
                                        <b>Rediger Passord</b>
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
                                <div className={classes.row}>
                                    <button
                                        className={classes.button}
                                        onClick={event =>
                                            this.eventHandler()
                                        }
                                    >
                                        ✓
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                <img src={profileBackground} className={classes.profileBackground}/>
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
        console.log(this.state.id);
        console.log(document.getElementById("oldPasswordInp").value);
        console.log(document.getElementById("passwordInp").value)
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

    }
    changePic() {
        if (
            document.getElementById('imgInput') !== null &&
            document.getElementById('imgInput') !== null &&
            document.getElementById('imgInput').value !== null
        ) {
            if (
                document.getElementById('profileImg') !== null &&
                document
                    .getElementById('imgInput')
                    .value.match(/\.(jpg|gif|png)$/) !== null
            ) {
                document.getElementById(
                    'profileImg'
                ).src = document.getElementById('imgInput').value;
                document.getElementById('imageFormId').style.visibility =
                    'hidden';
                if (document.getElementById('redigerBtn') !== null) {
                    document.getElementById('redigerBtn').style.visibility = 'visible';
                    document.getElementById('redigerBtn').style.pointerEvents = 'all';
                }
            }
            else {
                if (
                    document.getElementById('profileImg') !== null &&
                    document.getElementById('imgLabel') !== null &&
                    document.getElementById('imgLabel').innerHTML !== null
                ) {
                    document.getElementById('profileImg').src =
                        profileHolder;
                    document.getElementById('imgLabel').innerHTML =
                        'Du må skrive inn gyldig bildeLink!';
                }
            }
        }
    }
    showImageForm() {
        if (document.getElementById('redigerBtn') !== null) {
            document.getElementById('redigerBtn').style.visibility = 'hidden';
            document.getElementById('redigerBtn').style.pointerEvents = 'none';
        }

        if (document.getElementById('imageFormId') !== null) {
            document.getElementById('imageFormId').style.visibility = 'visible';
            document.getElementById('imgLabel').innerHTML = 'Link: ';
        }
    }
    showEditForm() {
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
