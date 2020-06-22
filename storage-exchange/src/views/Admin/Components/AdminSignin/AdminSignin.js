import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import rightarw from '../../../../Assets/Img/right-arw.png';
import './AdminSignin.css';

export default class AdminSignin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      signinError: ''
    };
  }
  handleSubmit(event, errors, values) {
    if (errors.length === 0) {
      this.setState({ isLoading: true, signinError: '' });
      const loginIp = {
        'UserName': values.UserName,
        'Password': values.Password,
        'UserTypeId': 1
      }

      axios.post(CONFIG.API_URL + 'Account/login/', loginIp)
        .then(response => {
          if (response.status === 200) {
            //let userDetail = response.data;
            this.setState({ isLoading: false });
            const getTokvalues = response.data.Token;
            localStorage.setItem('accessKey', response.data.Token);
            localStorage.setItem('name', response.data.FirstName + (response.data.LastName != null ? ' ' + response.data.LastName : ''));
            localStorage.setItem('email', response.data.Email);
            localStorage.setItem('role', response.data.Role);
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + getTokvalues.Token;
            const { from } = { from: { pathname: "/admin/dashboard/1" } };
            this.props.history.push(from);
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
          }

        });
    }
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
    document.title = CONFIG.PAGE_TITLE + 'Admin Sign In';
    const { isLoading, signinError } = this.state;

    return (
      <div className="page-height-fixed">
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <Row>
          <Col>
            <div className="admin-sign">
              <div className="heading">
                <h3>Admin Login</h3>
                {/* <div><span className="heading-broder"></span></div> */}
              </div>

              <Row>
                <div className="wrapper">
                  <div className="wrapper-content">
                    <div className="admin-head">
                      <h4>Sign In</h4>
                      {/* <span className="left-border"></span> */}
                    </div>
                    <AvForm onSubmit={this.handleSubmit.bind(this)} ref={c => (this.form = c)}>
                      <AvField name="UserName" label="" placeholder="Email" type="email" validate={{
                        required: { value: true, errorMessage: 'Username is required' }
                      }} />
                      <AvField name="Password" label="" placeholder="Password" type="password" validate={{
                        required: { value: true, errorMessage: 'Password is required' }
                      }} />
                      <div><Button color="primary" >Sign In</Button></div>
                      <Link to="/forgotpassword" className="forgot-right"><img src={rightarw} alt="" /> Forgot Password?</Link>
                      <span className="sign-error">{signinError}</span>
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
