import React, { Component } from 'react';
import classes from './ViewProfile.module.scss';
import { userService } from '../../services';
import profileHolder from '../../pictures/profileHolder.svg';
import UploadePic from '../Upload/UploadePic';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import ShowPassword from '../Password/Password';
import {history} from '../../containers/App';

export default class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            username: null,
            email: null,
            phone: null,
            firstName: null,
            surname: null,
            picture: null,
            artist: null,
            height: 512,
            showModal: false,
            deleteVisible: false,
            loading: true
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.handleToggleModal = this.handleToggleModal.bind(this);
    }
    handleToggleModal = () =>{
        this.setState(prevState => ({
            showModal: !prevState.showModal
        }));
    };
    handleEditButton = () =>{
        this.handleToggleModal();
    }
    async componentDidMount() {
        var intId = parseInt(this.props.match.params.id, 10);
        const user = await userService.getUser(intId);
        this.setState(user);
        this.setState({
            loading: false
        });
        document.getElementById("profileImg").src = this.state.picture;
        if(this.state.artist === 0){
            if(document.getElementById("titleP") !== null){
                document.getElementById("titleP").innerHTML = "Arrangør";
            }
        }
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
        this.errorHandler.bind(this);
        window.sessionStorage.setItem('artist',this.state.artist);
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    updateWindowDimensions(){
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }
    render() {
        if(this.state.loading) return <Spinner/>;
        if(this.state.width/this.state.height > 1 && this.state.width > 1400){
            return (
                <div className={classes.viewProfile}>
                    <div className={classes.row}>
                        <div className={classes.column} id={'imageColumn'}>
                            <div className={classes.imgContainer} id={"imgContainer"}>
                                <img
                                    className={classes.profile}
                                    id={'profileImg'}
                                    src={profileHolder}
                                    onError={
                                        this.fileError
                                    }
                                    alt="Profile picture"
                                />
                            </div>
                            <div>
                                <button
                                    className={classes.redigerBtn} id={"redigerBtn"} onClick={this.handleEditButton}
                                >
                                    ✎
                                </button>
                                <Modal  show={this.state.showModal}
                                        closed={this.handleToggleModal}>
                                    <UploadePic handleModal={this.handleToggleModal}/>
                                </Modal>
                            </div>
                        </div>
                        <div className={classes.bioLayer} id={"bioLayer"}>
                            <h1 className={classes.h1} id={'nameP'}>
                                {'' +
                                this.state.firstName +
                                ' ' +
                                this.state.surname +
                                ''}
                            </h1>
                            <p id="titleP">Artist</p>
                            <div className={classes.p} id={'emailP'}>
                                {this.state.email}
                            </div>
                            <button className={classes.redigerBrukerBtn} id={"redigerBrukerBtn"} onClick={this.showEditForm}>Rediger bruker</button>
                        </div>
                        <div className={classes.editLayer} id={"editLayer"}>
                            <h4 className={classes.editHeader}>
                                <b>Rediger Info</b>
                            </h4>
                            <button id={"deleteBtn"} className={classes.deleteButton} onClick={this.deleteUser}>Slett konto</button>
                            <input type={'password'} id={'passwordDeleteInp'} className={classes.passwordDeleteInp} placeholder={"Skriv passord"}/>
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
                                    <ShowPassword
                                        id={'oldPasswordInp'}
                                        strength={false}
                                    />
                                    <div className={classes.editTitle}>
                                        Nytt Passord
                                    </div>
                                    <ShowPassword
                                        id={'passwordInp'}
                                        strength={true}
                                    />
                                    <div className={classes.editTitle}>
                                        Gjenta nytt passord
                                    </div>
                                    <ShowPassword
                                        id={'repeatPasswordInp'}
                                        strength={true}
                                    />
                                </div>
                            </div>
                            <div className={classes.row}>
                                <p id={"errorMessage"} className={classes.errorMessage}></p>
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
        else{
            return (
                <div className={classes.viewProfile}>
                    <div className={classes.row}>
                        <div className={classes.column} id={'imageColumn'}>
                            <div className={classes.imgContainer} id={"imgContainer"}>
                                <img
                                    className={classes.profile}
                                    id={'profileImg'}
                                    src={profileHolder}
                                    onError={
                                        this.fileError
                                    }
                                    alt="Profile picture"
                                />
                            </div>
                            <button
                                className={classes.redigerBtn} id={"redigerBtn"} onClick={this.handleEditButton}
                            >
                                ✎
                            </button>
                            <Modal  show={this.state.showModal}
                                    closed={this.handleToggleModal}>
                                <UploadePic/>
                            </Modal>
                        </div>
                        <div className={classes.bioLayer} id={"bioLayer"}>
                            <h1 className={classes.h1} id={'nameP'}>
                                {'' +
                                this.state.firstName +
                                ' ' +
                                this.state.surname +
                                ''}
                            </h1>
                            <p id="titleP">Artist</p>
                            <div className={classes.p} id={'emailP'}>
                                {this.state.email}
                            </div>
                            <button className={classes.redigerBrukerBtn} id={"redigerBrukerBtn"} onClick={this.showEditForm}>Rediger bruker</button>
                        </div>
                        <div className={classes.editLayer} id={"editLayer"}>
                            <h4 className={classes.editHeader}>
                                <b>Rediger Info</b>
                            </h4>
                            <button id={"deleteBtn"} className={classes.deleteButton} onClick={this.deleteUser}>Slett konto</button>
                            <input type={'password'} id={'passwordDeleteInp'} className={classes.passwordDeleteInp} placeholder={"Skriv passord"}/>
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
                                    <h5 className={classes.editHeader}>
                                        <b>Endre Passord</b>
                                    </h5>
                                    <br/>
                                    <div className={classes.editTitle}>
                                        Gammel Passord
                                    </div>
                                    <ShowPassword
                                        id={'oldPasswordInp'}
                                        strength={false}
                                    />
                                    <div className={classes.editTitle}>
                                        Nytt Passord
                                    </div>
                                    <ShowPassword
                                        id={'passwordInp'}
                                        strength={true}
                                    />
                                    <div className={classes.editTitle}>
                                        Gjenta nytt passord
                                    </div>
                                    <ShowPassword
                                        id={'repeatPasswordInp'}
                                        strength={true}
                                    />
                            <div className={classes.row}>
                                <p id={"errorMessage"} className={classes.errorMessage}></p>
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
    }
    eventHandler() {
        let errorEvent = false;
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
        let emptyOld = true;
        let emptyNew = true;
        let emptyRepeat = true;

        if(document.getElementById('oldPasswordInp') !== null && document.getElementById('oldPasswordInp').value !== ''){
            emptyOld = false;
        }
        if(document.getElementById('passwordInp') !== null && document.getElementById('passwordInp').value !== ''){
            emptyNew = false;
        }
        if(document.getElementById('repeatPasswordInp') !== null && document.getElementById('repeatPasswordInp').value !== ''){
            emptyRepeat = false;
        }
        let emptyAll = (emptyOld && emptyNew && emptyRepeat);
        console.log(emptyOld);
        console.log(emptyNew);
        console.log(emptyRepeat);
        console.log(emptyAll);

        if(!emptyAll) {
            if (emptyOld) {
                this.errorHandler("Gammelt passord kan ikke være tom.");
                errorEvent = true;
            }
            if (emptyNew) {
                this.errorHandler("Nytt passord kan ikke være tom.");
                errorEvent = true;
            }
            if (emptyRepeat) {
                this.errorHandler("Nytt passord må gjentas.");
                errorEvent = true;
            }
        }
        if(!errorEvent && !emptyAll){
            if(document.getElementById("repeatPasswordInp") !== null && document.getElementById("oldPasswordInp") !== null){
                if(document.getElementById("repeatPasswordInp").value !== document.getElementById("passwordInp").value){
                    this.errorHandler("Nytt passord og gjentatt nytt passord må være lik.");
                    errorEvent = true;
                }
                else{
                    if(!this.checkUpdatePassword()){
                        this.errorHandler("Feil med gammelt passord, prøv på nytt.");
                        errorEvent = true;
                    }
                }
            }
        }
        if(!errorEvent){
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
    }
    checkUpdatePassword(){
        let verified = true;
        userService.updatePassword(this.state.id,(document.getElementById("oldPasswordInp").value),(document.getElementById('passwordInp').value))
            .catch((error: Error) => {
                verified = false;
                this.errorHandler(error.message);
            });
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
            .catch((error: Error) => this.errorHandler(error));
        if(document.getElementById("errorMessage") !== null){
            document.getElementById("errorMessage").innerHTML = '';
        }
        if(document.getElementById("editLayer") !== null){
            document.getElementById("editLayer").style.visibility = 'hidden';
            document.getElementById("editLayer").style.pointerEvents = 'none';
        }
        if(document.getElementById("redigerBrukerBtn") !== null){
            document.getElementById("redigerBrukerBtn").style.visibility = 'visible';
            document.getElementById("redigerBrukerBtn").style.pointerEvents = 'all' +
                '';
        }
        if(document.getElementById("passwordDeleteInp") !== null){
            document.getElementById("passwordDeleteInp").style.visibility = 'hidden';
            document.getElementById("passwordDeleteInp").style.pointerEvents = 'none';
            this.setState({deleteVisible: false});
        }
        document.getElementById('oldPasswordInp').value = '';
        document.getElementById('repeatPasswordInp').value = '';
        document.getElementById('passwordInp').value = '';

        if(document.getElementById("imgContainer") !== null && document.getElementById("redigerBtn") !==
            null && document.getElementById("bioLayer") !== null) {
            if(window.innerWidth > 1000){
                document.getElementById("imgContainer").style.left = "calc(50% - 11vw)";
                document.getElementById("bioLayer").style.left = "calc(50% - 12vw)";
                document.getElementById("redigerBtn").style.left = "calc(50% - 10vw)";
            }
        }

    }

    errorHandler(error){
        if(document.getElementById("errorMessage") !== null && error !== 'undefined'){
            document.getElementById("errorMessage").innerHTML = error;
        }
    }
    deleteUser(){
        if(this.state.deleteVisible){
            if(document.getElementById("passwordDeleteInp") !== null){
                if(document.getElementById("passwordDeleteInp").value !== ''){
                    if(window.confirm("Are you sure?")){
                        console.log(window.sessionStorage.getItem("user"));
                        userService.deleteUser(window.sessionStorage.getItem("user"),document.getElementById("passwordDeleteInp").value)
                            .then(() => {
                                window.sessionStorage.removeItem('jwt');
                                window.sessionStorage.removeItem('user');
                                history.push('/');
                            })
                    }
                }
            }
        }
        else {
            this.setState({deleteVisible: true});
            if(document.getElementById("passwordDeleteInp") !== null){
                document.getElementById("passwordDeleteInp").style.visibility = "visible";
                document.getElementById("passwordDeleteInp").style.pointerEvents = "all";
            }
        }
    }
    showEditForm() {
        if(document.getElementById("imgContainer") !== null && document.getElementById("redigerBtn") !==
        null && document.getElementById("bioLayer") !== null) {
            if(window.innerWidth > 1000){
                document.getElementById("imgContainer").style.left = "11%";
                document.getElementById("bioLayer").style.left = "10%";
                document.getElementById("redigerBtn").style.left = "calc(10% + 3vw)";
            }
            else{
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
    fileError(){
        if((document.getElementById('profileImg')) !== null){
            document.getElementById('profileImg').src = profileHolder;
        }
    }
}
