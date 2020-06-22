import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../Utils/config';
import rightarw from './../../Assets/Img/right-arw.png';
import axios from 'axios';
import './Signin.css';

export default class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            signinError: ''
        };
    }

    handleSubmit(event, errors, values) {

        if (errors.length === 0) {
            this.setState({ isLoading: true });
            const loginIp = {
                'UserName': values.UserName,
                'Password': values.Password,
                'UserTypeId': values.UserTypeID
            }

            axios.post(CONFIG.API_URL + 'Account/login/', loginIp)
                .then(response => {
                    if (response.status === 200) {
                        if (values.UserTypeID === "2") {
                            if (!response.data.IsConfirmed) {
                                localStorage.setItem('email', response.data.Email);
                                const { from } = { from: { pathname: "/resetpassword/0/" + encodeURIComponent(response.data.PasswordResetToken) } };
                                this.props.history.push(from);
                            }

                        }
                        const getTokvalues = response.data.Token;
                        localStorage.setItem('accessKey', response.data.Token);
                        localStorage.setItem('id', response.data.Id);
                        localStorage.setItem('name', response.data.FirstName + (response.data.LastName != null ? ' ' + response.data.LastName : ''));
                        localStorage.setItem('email', response.data.Email);
                        localStorage.setItem('role', response.data.Role);
                        localStorage.setItem('sessionId',response.data.SessionId);
                        axios.defaults.headers.common["Authorization"] = 'Bearer ' + getTokvalues.Token;
                        if (values.UserTypeID === "2") {
                            const { from } = { from: { pathname: "/buyer/dashboard" } };
                            this.props.history.push(from);
                        }
                        else {
                            const { from } = { from: { pathname: "/seller/dashboard" } };
                            this.props.history.push(from);
                        }

                    }
                })
                .catch(err => {

                    this.setState({ isLoading: false });
                    if (err.response != null && err.response.status === 400) {
                        const signinError = err.response.data;
                        this.setState({ signinError });
                    }
                    else {
                        const signinError = "Something went wrong.";
                        this.setState({ signinError });
                        // console.log(err.response.status)
                        // if(err.response.status===404){
                        //     this.props.history.push('/contactus')
                        // }
                    }

                });
        }
    }

    goToRegister() {
        const { from } = { from: { pathname: "/buyer-registration/" } };
        this.props.history.push(from);

    }
    componentDidMount() {
        localStorage.removeItem('accessKey');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('buyerStoreIDs');
        window.scrollTo(0, 0);
    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Sign In';
        const { isLoading, signinError } = this.state;
        return (
            <div className="page-height-fixed">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <Row>
                    <Col>
                        <div className="sign-in">
                            <div className="heading">
                                <h3>Login Account</h3>
                                {/* <div><span className="heading-broder"></span></div> */}
                            </div>
                            <Row>
                                <div className="wrapper">
                                    <div className="wrapper-content">
                                        <div>
                                            <h4>User Login</h4>
                                            {/* <span className="left-border"></span> */}
                                        </div>
                                        <AvForm onSubmit={this.handleSubmit.bind(this)} ref={c => (this.form = c)}>
                                            <AvField name="UserName" label="" type="email" className="user-signin" placeholder="Email" validate={{
                                                required: { value: true, errorMessage: 'Username is required' }
                                            }} />
                                            <AvField name="Password" label="" type="password" className="pass-signin" placeholder="Password" validate={{
                                                required: { value: true, errorMessage: 'Password is required' }
                                            }} />
                                            <AvRadioGroup inline name="UserTypeID" className="sign-option" label="" required>
                                                <AvRadio label="Buyer" value="2" />
                                                <AvRadio label="Seller" value="3" />
                                            </AvRadioGroup>
                                            <div><Button color="primary" className="sign-btn">Login</Button></div>
                                            <Link to="/forgotpassword" className="forgot-right"><img src={rightarw} alt="" /> Forgot Password?</Link>
                                            <span className="sign-error">{signinError}</span>
                                        </AvForm>
                                        <div className="crt-sign"><Button onClick={this.goToRegister.bind(this)} color="primary" className="sign-create">Create an New Account? - Sign Up</Button></div>
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
