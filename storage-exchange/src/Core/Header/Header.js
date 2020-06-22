import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup, NavbarText } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from './../../Utils/config';
import './Header.css';
import signin from './../../Assets/Img/signin-icon.png';
import mobile_icon from './../../Assets/Img/miobile-icon.png';
import social_icon from './../../Assets/Img/linkedin-social.png';
import dropdown_icon from './../../Assets/Img/dropdown.png';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavItem,
} from 'reactstrap';

import { getToken, getUserType, getName } from '../../Utils/localStorage';
import { USERTYPES } from '../../Utils/config';

var images = require.context('./../../Assets/Img', true);

class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            activeMenu: 'home',
            toggleLogout: false,
            sellMyPropertyModal: false,
            error: ''
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    signOut() {
        localStorage.removeItem('accessKey');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        const { from } = { from: { pathname: "/" } };
        this.props.parm.children.props.history.push(from)
        window.location.reload();
    }

    toggleClose() {
        this.setState({ sellMyPropertyModal: false });
    }

    sellMyProperty() {
        this.setState({ sellMyPropertyModal: true });
    }

    sellMyPropertyRequest(event, errors, values) {
        this.setState({ error: '' });
        if (errors.length === 0) {
          const data = {
            'Name': values.Name,
            'Phone': values.Phone,
            'Email': values.Email,
            'Message': values.Message
          }
    
          axios.post(CONFIG.API_URL + 'home/sell/myproperty', data)
            .then(response => {
                if (response.status === 200) {
                    if (response.data != "success") {
                        const error = response.data;
                        this.setState({ error });
                    } else {
                        alert("Thank you for reaching out. One of our agents will be in touch shortly.");
                        this.setState({ sellMyPropertyModal: false });
                    }
                }
            })
            .catch(err => {
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
        var token = getToken();
        var userType = getUserType();
        var name = getName();
        this.setState({ token, name, userType });
        window.scrollTo(0, 0);
    }

    activeClass = (menu) => {
        this.setState({
            activeMenu: menu,
        });
    }

    toggleLogout = (toggleLogout) => {
        this.setState({ toggleLogout });
    }

    render() {
        let img_src = images(`./storage-exchange.png`);
        const { token, name, userType, activeMenu, toggleLogout, sellMyPropertyModal, error } = this.state;
        return (

            <div className="header page-sticky">
                <Container-fluid>
                    <div className="row top-nav">
                        <div className="col-md-6">
                            <div>
                                <Link to="/" >
                                    <img src={img_src} className="logo" alt="" />
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <ul className="top-num">
                                <li><b>Contact: 720-310-0113</b></li>
                                {/* <li><img src={social_icon} className="social" alt="LinkedIn" title="LinkedIn" /></li> */}
                                <li>
                                    {!token ?
                                        <Link to="/signin" className="Sign-in-btn"><img src={signin} className="sign_icon" alt="sign in" /> <b>SIGN IN</b></Link>
                                        :
                                        <React.Fragment>
                                            {'Welcome ' + name}
                                            <div className="dropdown btn-dropdown-header">
                                                <button onClick={() => this.toggleLogout(!toggleLogout)} className="dropbtn"><img src={dropdown_icon} alt="" /></button>
                                                <div className={toggleLogout ? "dropdown-content-show" : "dropdown-content"}>
                                                    <Link onClick={this.signOut.bind(this)}>Logout</Link>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>

                </Container-fluid>

                <Navbar color="dark" dark expand="md" className="menu-bar">
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem onClick={() => this.activeClass("home")}>
                                <Link className={activeMenu == "home" && this.props.parm.children.props.match.path == "/" ? "active" : "inactive"} to="/" >Home</Link>
                            </NavItem>
                            <NavItem onClick={() => this.activeClass("listings")}>
                                <Link className={activeMenu == "listings" || this.props.parm.children.props.match.path == "/property/search/" || this.props.parm.children.props.match.path == "/property/search/:keyword" ? "active" : "inactive"} to="/property/search/" >Listings</Link>
                            </NavItem>
                            {/* <NavItem onClick={() => this.activeClass("vendor")}>
                                <Link className={activeMenu == "vendor" || this.props.parm.children.props.match.path == "/profilelist/:parentCategoryID/:parentCategoryName/:childCategoryID/:childCategoryName" || this.props.parm.children.props.match.path == "/categorylist/" ? "active" : "inactive"} to="/categorylist" >Vendors</Link>
                            </NavItem> */}
                            {/* <NavItem onClick={() => this.activeClass("service")}>
                                <Link className={activeMenu == "service" || this.props.parm.children.props.match.path == "/schedules/" ? "active" : "inactive"} to="/schedules" >Services</Link>
                            </NavItem> */}
                            <UncontrolledDropdown nav inNavbar >
                               <DropdownToggle nav caret onClick={() => this.activeClass("service")} className="menu-link-drop">
                                 <Link className={activeMenu == "service " || this.props.parm.children.props.match.path == "/schedules/" ? "active left-remove-padd" : "inactive left-remove-padd"} to="/schedules" >Services</Link>
                               </DropdownToggle>
                               <DropdownMenu right>
                               <DropdownItem>
                                 Sell Side
                               </DropdownItem>
                               <DropdownItem>
                                 Buy Side
                               </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                            <NavItem onClick={() => this.activeClass("about")}>
                                <Link className={activeMenu == "about" || this.props.parm.children.props.match.path == "/schedules/" ? "active" : "inactive"} to="/schedules" >About Us</Link>
                            </NavItem>
                            <NavItem onClick={() => this.activeClass("contact")}>
                                <Link className={activeMenu == "contact" || this.props.parm.children.props.match.path == "/contactus/" ? "active" : "inactive"} to="/contactus" >Contact Us</Link>
                            </NavItem>
                            <NavItem onClick={() => this.activeClass("sellmyproperty")}>
                                <Link className={activeMenu == "sellmyproperty" || this.props.parm.children.props.match.path == "/sellmyproperty/" ? "active" : "inactive"} onClick={this.sellMyProperty.bind(this)}>Sell My Property</Link>
                            </NavItem>
                        </Nav>
                        <Nav className="my-dashboard-menu">
                            {userType ?
                                <NavItem>
                                    <Link to={userType == USERTYPES.Buyer ? "/buyer/dashboard" : userType == USERTYPES.Seller ? "/seller/dashboard" : "/admin/dashboard/1"}> My DashBoard</Link>
                                </NavItem>
                                : ''}
                        </Nav>
                    </Collapse>
                </Navbar>

                <Modal size="md" isOpen={this.state.sellMyPropertyModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                    <ModalHeader className="notification-popup" toggle={this.toggleClose.bind(this)}>Sell My Property
                    </ModalHeader>
                    <ModalBody className="overflow-scroll basic-details notification-body">
                        <AvForm onSubmit={this.sellMyPropertyRequest.bind(this)} ref={c => (this.myFormRef = c)}>
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
                                <AvField type="textarea" name="Message" className="description-box-height" label="Message:" 
                                validate={{
                                    required: { value: true, errorMessage: 'Message is required' },
                                }} />
                            </Col>                      
                            </Row>
                            <Row className="save-right">
                            <Col md={12}>
                              <Button className="submit-msg-btn">Submit</Button>
                              <Button className="cancle-btn-msg" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                                <br/>
                                <span className="sign-error">{error}</span>
                            </Col>
                            </Row>
                        </AvForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Header;