
import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import './ForgotPassword.css';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSuccess: false,
            error: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event, errors, values) {
        if (errors.length === 0) {
            this.setState({ isLoading: true, isSuccess: false, error: '' });
            const data = {
                'UserName': values.Email,
            }

            axios.post(CONFIG.API_URL + 'Account/forgotpassword/', data)
                .then(response => {
                    if (response.status === 200) {
                        this.setState({ isLoading: false, isSuccess: true });

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
        document.title = CONFIG.PAGE_TITLE + 'Forgot Password';
        const { isLoading, error, isSuccess } = this.state;
        return (
            <div className="page-height-fixed">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <Row>
                    <Col>
                        <div className="forgot-password">
                            <Row>
                                <div className="wrapper">
                                    {isSuccess ?
                                        <span className="success">Password reset link has been sent to your email.</span>
                                        : ''}

                                    <div className="wrapper-content">
                                        <div>
                                            <h4>Forgot Password</h4>
                                            {/* <span className="left-border"></span> */}

                                            <AvForm onSubmit={this.handleSubmit.bind(this)} ref={c => (this.form = c)}>
                                                <AvField name="Email" label="" placeholder="Your Email ID" type="email" maxLength="255" validate={{
                                                    required: { value: true, errorMessage: 'Email is required' },
                                                    pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, errorMessage: 'Email is invalid' }
                                                }} />
                                                <Button color="primary" className="reset-btn">Submit</Button>
                                                <span className="sign-error">{error}</span>
                                            </AvForm>

                                        </div>
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