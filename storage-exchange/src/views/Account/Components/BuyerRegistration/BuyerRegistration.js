import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link} from "react-router-dom";
import { CONFIG, USERTYPES } from '../../../../Utils/config';
import axios from 'axios';
import './BuyerRegistration.css';

const validateProperties = (value, ctx) => {
    if (isNaN(ctx.NumberOfProperties)) {
        return "No Of Properties should be a number";
    } else if (ctx.RentableSQFT <= 0 && ctx.RentableSQFT != "") {
        return "No Of Properties should be greater than zero";
    }
    return true;
}

export default class BuyerRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            registerError: '',
            isRegisterSuccess: false,
            storeID: 0,
            storeName: 'empty',
            stateList: [],
            state: 0,
            position: 0,
            positionList: [],
        };
        this.resetForm = this.resetForm.bind(this);
    }

    getLookupValues() {

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'lookup/state')
            .then(res => {
                let stateList = res.data;
                this.setState({ stateList })

            })
            .catch((err) => {
                console.log(err);
            })

        axios.get(CONFIG.API_URL + 'lookup/user/position')
            .then(res => {
                let positionList = res.data;
                this.setState({ positionList })

            })
            .catch((err) =>{ 
                console.log(err)
                // <Redirect path to='/signin'/>
            })

    }

    handleChange(e) {

        var value = e.target.value;
        this.setState({ [e.target.name]: value })
    }

    handleSubmit(event, errors, values) {
        if (errors.length === 0) {
            const { state, position, storeID, storeName } = this.state;

            this.setState({ isLoading: true, registerError: '' });

            const data = {
                'FirstName': values.FirstName,
                'LastName': values.LastName,
                'City': values.City,
                'Username': values.Email,
                'Email': values.Email,
                'PhoneNumber': values.Phone,
                //'CapitalSource': values.CapitalSource,
                //'NumberOfProperties': values.NumberOfProperties,
                'CompanyName': values.CompanyName,
                'StateId': state,
                'PositionID': values.position,
                'UserTypeID': values.userType,
                'IsHavingSelfStorages': values.ownselfstorage
                //'Question': values.Question,
            }
            axios.post(CONFIG.API_URL + 'account/register/user/', data)
                .then(response => {
                    if (response.status === 200) {
                        if (response.data != "User has been created successfully") {
                            const registerError = response.data;
                            this.setState({ registerError, isLoading: false });
                        } else {
                            this.setState({ isLoading: false, isRegisterSuccess: true });
                        }
                    }
                })
                .catch(err => {
                    this.setState({ isLoading: false });
                    if (err.response != null && err.response.status === 400) {
                        const registerError = err.response.data;
                        this.setState({ registerError });
                    }
                    else {
                        const registerError = "Something went wrong.";
                        this.setState({ registerError });
                    }

                });
        }
    }

    resetForm(event) {
        this.form.reset();
    }

    componentDidMount() {
        if (this.props.match.params.StoreName) {
            this.setState({ storeName: decodeURI(this.props.match.params.StoreName) });
        }
        if (this.props.match.params.storeID) {
            this.setState({ storeID: this.props.match.params.storeID });
        }
        this.getLookupValues();
        this.setState({ isRegisterSuccess: false });
    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Buyer Registration';
        const { isLoading, registerError, isRegisterSuccess, stateList, state, position, positionList } = this.state;
        if (isRegisterSuccess === false) {
            return (
                <div>
                    {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                    <Row>
                        <Col>
                            <div className="buyer-register">
                                <div className="heading">
                                    <h3>Create Account</h3>
                                    {/* <div><span className="heading-broder"></span></div> */}
                                    <p>To access additional property details, please register below.</p>
                                </div>

                                <Row>
                                    <div className="wrapper">
                                        <div className="wrapper-content">
                                            <div>
                                                <h4>Register</h4>
                                                <span className="left-border"></span>
                                            </div>
                                            <div className="register-create">

                                                <AvForm onSubmit={this.handleSubmit.bind(this)} onReset={this.resetForm.bind(this)} ref={c => (this.form = c)}>
                                                    <Row>
                                                        <div className="width-half">
                                                            <AvField name="FirstName" label="First Name" placeholder="" type="text" maxLength="255" validate={{
                                                                required: { value: true, errorMessage: 'First Name is required' }
                                                            }} />
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField name="LastName" label="Last Name" placeholder="" type="text" maxLength="255" validate={{
                                                                required: { value: true, errorMessage: 'Last Name is required' }
                                                            }} />
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField name="Email" label="Your Email" placeholder="" type="email" maxLength="255" validate={{
                                                                required: { value: true, errorMessage: 'Email is required' },
                                                                pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, errorMessage: 'Email is invalid' }
                                                            }} />
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField name="City" label="City" placeholder="" type="text" maxLength="255" validate={{
                                                                required: { value: true, errorMessage: 'City is required' }
                                                            }} />
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField type="select" name="state" value={state}
                                                                onChange={(e) => this.handleChange(e)}
                                                                label="State"
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'State is required' },
                                                                }}>
                                                                <option value="0">--Select--</option>
                                                                {stateList ? stateList.map(n => {
                                                                    return (
                                                                        <option key={n.ID} className={n.ID === '' ? "optHead" : ''}
                                                                            disabled={n.ID === '' ? true : false}
                                                                            value={n.ID}>
                                                                            {n.Name}
                                                                        </option>
                                                                    );
                                                                }) : ''}
                                                            </AvField>
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField name="Phone" label="Phone Number" placeholder="000-000-0000" type="text"
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Phone Number is required' },
                                                                    pattern: { value: /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, errorMessage: 'Phone Number is invalid' }
                                                                }} />
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField name="CompanyName" label="Company" placeholder="" type="text" maxLength="1000" validate={{
                                                                required: { value: true, errorMessage: 'Company is required' }
                                                            }} />
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField type="select" name="position" value={position}
                                                                onChange={(e) => this.handleChange(e)}
                                                                label="Position"
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'Position is required' },
                                                                }}>
                                                                <option key={0} value="0">--Select--</option>
                                                                {positionList ? positionList.map(n => {
                                                                    return (
                                                                        <option key={n.ID} className={n.ID === '' ? "optHead" : ''}
                                                                            disabled={n.ID === '' ? true : false}
                                                                            value={n.ID}>
                                                                            {n.Name}
                                                                        </option>
                                                                    );
                                                                }) : ''}
                                                            </AvField>
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField type="select" name="ownselfstorage"
                                                                onChange={(e) => this.handleChange(e)}
                                                                label="Do you currently own one or more self-storage facilities? "
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'own self-storage facilities is required' },
                                                                }}>
                                                                <option key={2} value="0">--Select--</option>
                                                                <option key={0}
                                                                    value={true}>
                                                                    {"Yes"}
                                                                </option>
                                                                <option key={1}
                                                                    value={false}>
                                                                    {"No"}
                                                                </option>
                                                            </AvField>
                                                        </div>
                                                        <div className="width-half">
                                                            <AvField type="select" name="userType"
                                                                onChange={(e) => this.handleChange(e)}
                                                                label="I’m interested in"
                                                                validate={{
                                                                    required: { value: true, errorMessage: 'I’m interested in is required' },
                                                                }}>
                                                                <option key={4} value="0">--Select--</option>
                                                                <option key={0}
                                                                    value={USERTYPES.Seller}>
                                                                    {"Selling"}
                                                                </option>
                                                                <option key={1}
                                                                    value={USERTYPES.Buyer}>
                                                                    {"Buying"}
                                                                </option>
                                                                <option key={3}
                                                                    value={USERTYPES.Both}>
                                                                    {"Both"}
                                                                </option>
                                                            </AvField>
                                                        </div>
                                                        {/* <div className="width-half">
                                                <AvField name="NumberOfProperties" label="No of Properties" placeholder="" type="text" maxLength="255"
                                                    validate={{ myValidation: validateProperties }}
                                                />
                                                </div>
                                                <div className="width-half">
                                                <AvField name="CapitalSource" label="Capital Source" placeholder="" type="text" maxLength="2000" validate={{
                                                    required: { value: true, errorMessage: 'Capital Source is required' }
                                                }} />
                                                </div>
                                                <div className="width-full">
                                                <AvField name="Question" label="Your Question" placeholder="" className="txt-area" maxLength="4000" type="textarea" validate={{
                                                    required: { value: true, errorMessage: 'Question is required' }
                                                }} />
                                                </div> */}
                                                    </Row>
                                                    <div className="width-full textright">
                                                        <Button className="btn-reset" type="reset">Clear</Button>
                                                        <Button className="btn-create-submit" type="submit">Submit</Button>
                                                        <span className="sign-error-register">{registerError}</span>
                                                    </div>
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
        } else {
            return (
                <div className="reg-acknowledgement">
                    <h4>Acknowledgement</h4>
                    <div><span className="heading-broder"></span></div>
                    <p>Thank you for registering with us! <br />
                        Email has been sent to you. Please check your email  </p>
                </div>);
        }
    }
}
