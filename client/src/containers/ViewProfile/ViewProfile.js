import React, { Component } from 'react';
import classes from './ViewProfile.module.scss';
import { userService } from '../../services';

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

        console.log(user);

        this.setState(user);
    }
    render() {
        return (
            <div className={classes.viewProfile}>
                <div className={classes.showLayer}>
                    <div className={classes.row}>
                        <div className={classes.column} id={'imageColumn'}>
                            <div className={classes.imgContainer}>
                                <img
                                    className={classes.profile}
                                    id={'profileImg'}
                                    src="https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg"
                                    alt="Profile picture"
                                />
                            </div>
                            <button
                                className={classes.redigerBtn}
                                onClick={this.showImageForm}
                            >
                                Rediger profilbilde
                            </button>
                            <div
                                className={classes.imageForm}
                                id={'imageFormId'}
                            >
                                <div className={classes.row}>
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
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className={classes.redigerBrukerBtn} id={"redigerBrukerBtn"}>Rediger bruker</button>
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
                            </div>
                            <div className={classes.editLayer}>
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
                console.log("heinrich")
                if(document.getElementById('oldPasswordInp') !== null &&
                document.getElementById('oldPasswordInp').value !== ''){
                    console.log("helsikke")
                    if(this.checkUpdatePassword()){
                        console.log("woop");
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
    }
    changePic() {
        console.log('helsikke');
        if (
            document.getElementById('imgInput') !== null &&
            document.getElementById('imgInput') !== null &&
            document.getElementById('imgInput').value !== null
        ) {
            console.log('helsikke2');
            if (
                document.getElementById('profileImg') !== null &&
                document
                    .getElementById('imgInput')
                    .value.match(/\.(jpg|gif|png)$/) != null
            ) {
                console.log('helsikke3');
                document.getElementById(
                    'profileImg'
                ).src = document.getElementById('imgInput').value;
                document.getElementById('imageFormId').style.visibility =
                    'hidden';
            } else {
                if (
                    document.getElementById('profileImg') !== null &&
                    document.getElementById('imgLabel') !== null &&
                    document.getElementById('imgLabel').innerHTML !== null
                ) {
                    document.getElementById('profileImg').src =
                        'https://images.assetsdelivery.com/compings_v2/apoev/apoev1806/apoev180600175.jpg';
                    document.getElementById('imgLabel').innerHTML =
                        'Du må skrive inn gyldig bildeLink!';
                }
            }
        }
    }
    showImageForm() {
        console.log('heinrich');
        if (document.getElementById('imageFormId') !== null) {
            document.getElementById('imageFormId').style.visibility = 'visible';
            document.getElementById('imgLabel').innerHTML = 'Link: ';
        }
    }
}
