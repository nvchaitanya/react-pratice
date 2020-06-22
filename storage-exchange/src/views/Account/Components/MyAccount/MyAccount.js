import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import './MyAccount.css';

export default class MyAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: '',
            user: undefined,
            isChangePassword: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    handleSubmit(event, errors, values) {
        if (errors.length === 0) {
            this.setState({ isLoading: true });
            let storeID = this.state.storeID;
            let storeName = this.state.storeName;

            const data = {
                'FirstName': values.FirstName,
                'LastName': values.LastName,
                'Email': values.Email,
                'PhoneNumber': values.Phone,
            }

            let token = localStorage.getItem('accessKey');
            if (token) {
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.post(CONFIG.API_URL + 'account/update/profile/', data)
                .then(response => {
                    if (response.status === 200) {
                        //when email changed need to update token
                        if (response.data != "success") {
                            const getTokvalues = response.data.Token;
                            localStorage.setItem('accessKey', response.data.Token);
                            localStorage.setItem('name', response.data.FirstName + (response.data.LastName != null ? ' ' + response.data.LastName : ''));
                            localStorage.setItem('email', response.data.Email);
                            localStorage.setItem('role', response.data.Role);
                            axios.defaults.headers.common["Authorization"] = 'Bearer ' + getTokvalues.Token;

                        }
                        this.setState({ isLoading: false, success: "Account updated successfully", error: '' });
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    if (err.response != null && err.response.status === 400) {
                        const error = err.response.data;
                        this.setState({ error, success: '' });
                    }
                    else {
                        const error = "Something went wrong.";
                        this.setState({ error });
                    }

                });
        }
    }

    resetForm(event) {
        this.form.reset();
    }

    getProfile() {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'account/profile/')
            .then(response => {
                if (response.status === 200) {
                    var user = response.data;
                    this.setState({ isLoading: false, user });
                }
            })
            .catch(err => {
                this.setState({ isLoading: false });
                if (err.response != null && err.response.status === 400) {
                    const error = err.response.data;
                    this.setState({ error, success: '' });
                }
                else {
                    const error = "Something went wrong.";
                    this.setState({ error });
                }

            });
    }

    componentDidMount() {
        this.getProfile();
    }

    changePasswordSubmit(event, errors, values) {
        if (errors.length === 0) {
            this.setState({ isLoading: true });
            const data = {
                'Password': values.Password,
                'ConfirmPassword': values.ConfirmPassword
            }

            let token = localStorage.getItem('accessKey');
            if (token) {
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.post(CONFIG.API_URL + 'Account/changepassword/', data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ isLoading: false, success: "Password changed successfully", isChangePassword: false, error: '' });
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    if (err.response != null && err.response.status === 400) {
                        const error = err.response.data;
                        this.setState({ error, success: '' });
                    }
                    else {
                        const error = "Something went wrong.";
                        this.setState({ error });
                    }

                });
        }
    }

    changePasswordOnclick() {
        this.setState({ isChangePassword: true });
    }

    resetChangePassword() {
        this.setState({ isChangePassword: false });
    }


    render() {
        document.title = CONFIG.PAGE_TITLE + 'My Account';
        const { isLoading, error, user, isChangePassword, success } = this.state;
        return (
            <main className="dashboard-layout-height background-clr-admin">

                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <Row>
                    <Col>
                        <div className="user-myaccount ">
                            <Row>
                                <div className="wrapper ">
                                    <div className="wrapper-content form-back-shadow">
                                        <div>
                                            <span className="success">{success}</span>
                                            <h3>Edit Account</h3>
                                            <span className="left-border"></span>
                                        </div>
                                        {user ?
                                            <React.Fragment>
                                                <AvForm onSubmit={this.handleSubmit.bind(this)} onReset={this.resetForm.bind(this)} ref={c => (this.form = c)}>
                                                    <AvField name="FirstName" label="First Name" placeholder="FirstName" type="text" maxLength="255"
                                                        value={user.FirstName} validate={{
                                                            required: { value: true, errorMessage: 'FirstName is required' }
                                                        }} />
                                                    <AvField name="LastName" label="Last Name" placeholder="LastName" type="text" maxLength="255"
                                                        value={user.LastName} validate={{
                                                            required: { value: true, errorMessage: 'LastName is required' }
                                                        }} />
                                                    <AvField name="Phone" label="Phone Number" placeholder="123-456-7899" type="text"
                                                        value={user.PhoneNumber} validate={{
                                                            required: { value: true, errorMessage: 'Phone Number is required' },
                                                            pattern: { value: /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, errorMessage: 'Phone Number is invalid' }
                                                        }} />
                                                    <AvField name="Email" label="Email" placeholder="Your Email ID" type="email" maxLength="255"
                                                        value={user.Email.toLowerCase()} validate={{
                                                            required: { value: true, errorMessage: 'Email is required' },
                                                            pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, errorMessage: 'Email is invalid' }
                                                        }} />
                                                    <Button color="primary" type="submit">Submit</Button>
                                                    <br />
                                                    <span className="sign-error">{error}</span>
                                                </AvForm>
                                                <Link to="#" className="change-password-account" onClick={this.changePasswordOnclick.bind(this)}>Change Password</Link>

                                                <Modal size="md" id="tst2" name="tst2" isOpen={isChangePassword} toggle={this.resetChangePassword.bind(this)} className="model-popup edit-market-dashboard">
                                                    <ModalHeader toggle={this.resetChangePassword.bind(this)}>Change Password</ModalHeader>
                                                    <ModalBody className="overflow-scroll basic-details">
                                                        <AvForm onSubmit={this.changePasswordSubmit.bind(this)} onReset={this.resetChangePassword.bind(this)} ref={c => (this.form = c)}>
                                                            <AvField name="Password" label="" placeholder="Password" type="password" validate={{
                                                                required: { value: true, errorMessage: 'Password is required' },
                                                                pattern: { value: '^(.{0,}(([a-zA-Z][^a-zA-Z])|([^a-zA-Z][a-zA-Z])).{4,})|(.{1,}(([a-zA-Z][^a-zA-Z])|([^a-zA-Z][a-zA-Z])).{3,})|(.{2,}(([a-zA-Z][^a-zA-Z])|([^a-zA-Z][a-zA-Z])).{2,})|(.{3,}(([a-zA-Z][^a-zA-Z])|([^a-zA-Z][a-zA-Z])).{1,})|(.{4,}(([a-zA-Z][^a-zA-Z])|([^a-zA-Z][a-zA-Z])).{0,})$', errorMessage: 'Passwords are case-sensitive, must be between 6 to 25 characters and contain at least 1 letter and 1 number or special character.' },
                                                                minLength: { value: 6, errorMessage: 'Your Password must be 6 characters' },
                                                                maxLength: { value: 25, errorMessage: 'Your Password must be 25 characters' }
                                                            }} />
                                                            <AvField name="ConfirmPassword" label="" placeholder="Confirm Password" type="password" validate={{
                                                                required: { value: true, errorMessage: 'Confirm Password is required' },
                                                                match: { value: 'Password', errorMessage: 'Mismatch Confirm Password' }
                                                            }} />
                                                            <Row className="right-side-button">
                                                                <div>
                                                                    <Button color="primary" type="submit" className="btn-changepass">Change Password</Button>
                                                                    <Button color="primary" type="reset" className="cancel-btn-pass">Cancel</Button>
                                                                    <span className="sign-error">{error}</span>
                                                                </div>
                                                            </Row>
                                                        </AvForm>
                                                    </ModalBody>
                                                </Modal>
                                            </React.Fragment>
                                            : ''}
                                    </div>

                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>

            </main>);
    }
}
