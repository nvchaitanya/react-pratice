import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup, Form, FormText } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../Utils/config';
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import { Label, Input } from 'reactstrap';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import contact_icon from './../../Assets/Img/contact-us.png';
import address_icon from './../../Assets/Img/location-black.png';
import phone_icon from './../../Assets/Img/phone-details.png';
import mail_icon from './../../Assets/Img/mail-details.png';
import './ContactUs.css';

export default class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            optionName: ''
        };

        this.contactUsRequest = this.contactUsRequest.bind(this);
        this.optionChange = this.optionChange.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    componentDidMount() {
    }
    
    optionChange(e) {
        var value = e.target.value;
        this.setState({ optionName: value })
    }
    
    resetForm() {
        this.myFormRef && this.myFormRef.reset();
    }

    contactUsRequest(event, errors, values) {
        this.setState({ error: '' });
    if (errors.length === 0) {
      const data = {
        'Name': values.Name,
        'Phone': values.Phone,
        'Email': values.Email,
        'Option': this.state.optionName,
        'Message': values.Message
      }

      axios.post(CONFIG.API_URL + 'home/contactus', data)
        .then(response => {
            if (response.status === 200) {
                if (response.data != "success") {
                    const error = response.data;
                    this.setState({ error, isLoading: false });
                } else {
                    this.setState({ isLoading: false });
                    this.resetForm();
                    alert("Thank you for reaching out. One of our agents will be in touch shortly.");
                }
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
  };
    
    render() {
        document.title = CONFIG.PAGE_TITLE + 'Contact Us';
        const { isLoading, error } = this.state;

        return (
            <div>
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="vendor-profilelist">
                    <Container-fluid>
                        <div className="item">
                            <img src={contact_icon} className="" alt="" />
                            <div class="content">  <h2>Contact Us<br /> <span><Link to="/">Home</Link> / <Link to=''>Contact Us</Link></span></h2></div>
                        </div>
                    </Container-fluid>
                </div>
                <div className="contactuspage page-height-fixed">
                <div className="heading">
                    <h3>Contact Us</h3>
                    {/* <div><span className="heading-broder"></span></div> */}
                </div>
                <Row>
                    <div className="width-20">
                        <div>
                            <h6 className="getintouch">Contact Info</h6>
                        </div>
                        <div className="contact-info">
                        <ul className="listitem">
                                <li>
                                    <div className="item">
                                        <img src={address_icon} className="" alt="" />
                                        <div class="content">Storage Exchange, <br />75 Manhattan Drive,<br />Suite 304 (NEW LINE) Boulder,<br /> CO 80303.</div>
                                    </div>
                                </li>
                                <li>
                                    <div className="item">
                                        <img src={mail_icon} className="" alt="" />
                                        <div class="content"><a href="mailto:info@storageexchange.com">info@storageexchange.com</a></div>
                                    </div>
                                </li>
                                <li>
                                    <div className="item">
                                        <img src={phone_icon} className="" alt="" />
                                        <div class="content">720-310-0113</div>
                                    </div>
                                </li>
                        </ul>
                        </div>
                    </div>
                    <div className="width-80">
                        <div>
                            <h6 className="getintouch">Get in Touch</h6>
                        </div>
                        <div className="form-contact-box">
                            <AvForm onSubmit={this.contactUsRequest.bind(this)} ref={c => (this.myFormRef = c)}>
                            <Row>
                            <Col md={12}>
                                <AvField name="Name" label="Name:" type="text" validate={{
                                required: { value: true, errorMessage: 'Name is required' }
                                }} />
                            </Col>
                            <Col md={12}>
                                <AvField name="Phone" label="Phone:" placeholder="000-000-0000" validate={{
                                    required: { value: true, errorMessage: 'Phone is required' },
                                    pattern: { value: /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, errorMessage: 'Phone is invalid' }
                                 }}/>
                            </Col>
                            <Col md={12}>
                                <AvField name="Email" label="Email:" validate={{
                                    required: { value: true, errorMessage: 'Email is required' },
                                    pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, errorMessage: 'Email is invalid' }
                                }} />
                            </Col>
                            <Col md={12}>
                                <AvField type="select" name="Option" value={this.state.optionName}
                                    onChange={(e) => this.optionChange(e)} label="Option:"
                                    validate={{
                                        required: { value: true, errorMessage: 'Option is required' },
                                    }}>
                                    <option value="0">--Select--</option>
                                    <option>List my property</option>
                                    <option>Looking to buy a property</option>
                                    <option>Connect with agent</option>
                                    <option>Other</option>
                                </AvField>
                            </Col>
                            <Col md={12}>
                                <AvField type="textarea" name="Message" className="description-box-height" label="Message:" 
                                validate={{
                                    required: { value: true, errorMessage: 'Message is required' },
                                }} />
                            </Col>                      
                            </Row>
                            <Row className="save-right">
                            <Col md={12}>
                                <Button id="btn" className="button-contactus"><span>Send Email </span></Button>
                                <Button className="btn-reset" onClick={this.resetForm.bind(this)}>Reset</Button>
                                <br/>
                                <span className="sign-error">{error}</span>
                            </Col>
                            </Row>
                        </AvForm>
                        {/* <Form>
                        <FormGroup>
                            <Label>Name *</Label>
                            <Input type="text" name="name" placeholder="Name" />
                          </FormGroup>
                          <FormGroup>
                            <Label>Phone Number *</Label>
                            <Input type="text" name="phonenumber"  placeholder="000-000-0000" />
                          </FormGroup>
                          <FormGroup>
                            <Label>Email *</Label>
                            <Input type="email" name="email" id="exampleEmail" placeholder="Email" />
                          </FormGroup>
                          <FormGroup>
                            <Label>Select Option *</Label>
                            <Input type="select" name="select" id="exampleSelect">
                            <option>List my property</option>
                            <option>Looking to buy a property</option>
                            <option>Connect with agent</option>
                            <option>Other</option>
                            </Input>
                          </FormGroup>
                          <FormGroup>
                            <Label for="exampleText">Message *</Label>
                            <Input type="textarea" name="text" placeholder="" />
                          </FormGroup>
                          <Button className="button-contactus"><span>Send Email </span></Button>
                        </Form> */}
                        </div>
                    </div>
                </Row>
                </div>
            </div>
        );
    }
}
