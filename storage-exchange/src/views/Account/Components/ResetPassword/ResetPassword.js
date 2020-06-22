
import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import './ResetPassword.css';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: '',
            isForgotPassword: !!+this.props.match.params.isForgotPassword,
            passwordResetToken: this.props.match.params.PasswordResetToken
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, errors, values) {
        if (errors.length === 0) {
            this.setState({ isLoading: true });
            const { isForgotPassword } = this.state;

            var url = "Account/resetpassword/";
            var data = {
                "Token": decodeURIComponent(this.state.passwordResetToken),
                'Password': values.Password,
                'ConfirmPassword': values.ConfirmPassword,
                "TemporaryPassword": values.TemporaryPassword,
                "isForgotPassword": isForgotPassword ? true : false
            }

            axios.post(CONFIG.API_URL + url, data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ isLoading: false });

                        const getTokvalues = response.data.Token;
                        localStorage.setItem('accessKey', response.data.Token);
                        localStorage.setItem('name', response.data.FirstName + (response.data.LastName != null ? ' ' + response.data.LastName : ''));
                        localStorage.setItem('email', response.data.Email);
                        localStorage.setItem('role', response.data.Role);
                        axios.defaults.headers.common["Authorization"] = 'Bearer ' + getTokvalues.Token;
                        const { from } = { from: { pathname: "/buyer/dashboard" } };
                        this.props.history.push(from);
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    if (err.response != null && err.response.status === 400) {
                        const error = err.response.data;
                        this.setState({ error });
                    }
                    else {
                        const error = "Something went wrong.";
                        this.setState({ error });
                    }

                });
        }
    }

    componentDidMount() {
    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Reset Password';
        const { isLoading, error, isForgotPassword } = this.state;

        return (
            <div >
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <Row>
                    <Col>
                        <div className="reset-password">
                            <Row>
                                <div className="wrapper">
                                    <div className="wrapper-content">
                                        <div>
                                            <h4>Reset Password</h4>
                                            {!isForgotPassword ? <h6>Your account has been validated. please update your temporary password.</h6> : ''}
                                            <span className="left-border"></span>
                                        </div>
                                        <AvForm onSubmit={this.handleSubmit.bind(this)} ref={c => (this.form = c)}>
                                            {!isForgotPassword ? <AvField name="TemporaryPassword" label="" placeholder="Temporary Password" type="password" validate={{
                                                required: { value: true, errorMessage: 'Temporary Password is required' },
                                            }} /> : ''}
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
                                            <Button color="primary" className="reset-btn">Reset Password</Button>
                                            <span className="sign-error">{error}</span>
                                        </AvForm>

                                    </div>
                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}