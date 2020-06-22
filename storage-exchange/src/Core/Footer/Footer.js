import React, { Component } from 'react';
import './Footer.css';
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import address_icon from './../../Assets/Img/address.png';
import phone_icon from './../../Assets/Img/phone.png';
import mail_icon from './../../Assets/Img/mail.png';
import social_icon from './../../Assets/Img/white-linkedin.png';
import { getToken } from '../../Utils/localStorage';

class Footer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: '',
            disclaimerModal: false
        };

        this.toggleDisclaimerModal = this.toggleDisclaimerModal.bind(this);
    }

    toggleDisclaimerModal = () => this.setState(state => ({ disclaimerModal: !state.disclaimerModal }));

    toggleClose = () => this.setState(state => ({ disclaimerModal: false }));

    componentDidMount() {
        var token = getToken();
        this.setState({ token });
    }

    render() {
        const { token } = this.state;
        return (
            <div className="footer">
                <Container-fluid>
                    <Row>
                        <Col md="4">
                            <h5>About Us</h5>
                            {/* <div className="footer-border"><span className="bottom-broder"></span></div> */}
                            <p>Storage Exchange is uniquely qualified
            to serve as an outsourced acquisitions
            and capital deployment solution for
            established buyers and investors within
the self-storage industry.</p>
                            {/* <img src={social_icon} className="social" alt="Linkedin" title="linkedIn" /> */}
                        </Col>
                        <Col md="4">
                            <h5>Quick Links</h5>
                            {/* <div className="footer-border"><span className="bottom-broder"></span></div> */}
                            <ul class="footer-menu">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/property/search/">Listing</Link></li>
                                <li><Link to="/categorylist" >Vendors</Link></li>
                                <li><Link to="/">Services</Link></li>
                                {!token ? <li><Link to="/signin">Login</Link></li> : ''}
                            </ul>
                        </Col>
                        <Col md="4">
                            <h5>Contact Us</h5>
                            {/* <div className="footer-border"><span className="bottom-broder"></span></div> */}
                            <ul className="listitem">
                                <li>
                                    <div className="item">
                                        <img src={address_icon} className="" alt="" />
                                        <div class="content">Storage Exchange, <br />75 Manhattan Drive,<br />Suite 304 (NEW LINE) Boulder, CO 80303.</div>
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
                        </Col>
                        <p className="footer-para">The information presented here is deemed to be accurate, but it has not been independently verified. We make no guarantee, warranty or representation. It is your responsibility to independently confirm accuracy and completeness. All brochures,
projections, opinions, assumption or estimates used are examples only and are not represented as future performance of asset. </p>
                    </Row>
                </Container-fluid>
                <Container-fluid>
                    <Row className="footer-bottom">
                        <Col md="7">
                            <p>© Copyright 2020 Aggregate Intelligence - All Rights Reserved</p>
                        </Col>
                        <Col md="5" className="footer_right">
                            <p><Link onClick={this.toggleDisclaimerModal}>Disclaimer</Link></p>
                        </Col>
                    </Row>
                </Container-fluid>
                <Modal size="md" isOpen={this.state.disclaimerModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new disclmr-model edit-market-dashboard">
                    <ModalHeader toggle={this.toggleClose.bind(this)}>Disclaimer
                    </ModalHeader>
                    <ModalBody>
                        <div className="disclaimer-details">
                         <p>The information contained on this website is factual information only and is not intended to be business or investment advice, legal advice or tax advice and should not be relied upon as such.  The information is general in nature and may omit detail that could be significant to your particular circumstances.  The information is provided in good faith and derived from sources believed to be accurate and current at the date of publication. While commercially reasonable care has been taken to ensure the information is correct at the time of used in the investment overview, facts and circumstances can change from time to time, and Storage Exchange is not liable for and is deemed releases from any loss arising from reliance on this information, including reliance on information that is no longer current.  Should an investor elect to pursue an acquisition, it will need to independently confirm such facts and obtain representations and warranties from the seller in the investor’s discretion are necessary.</p>
                         <p>Certain information may be set forth contains “forward-looking information”, including “future oriented financial information” and “financial outlook”, under applicable securities and other laws (collectively referred to herein as ”forward-looking statements”). Except for statements of historical fact, information contained herein constitutes forward-looking statements and includes, but is not limited to, the (i) projected financial performance of the described company and related assets (collectively, the “Business”); (ii) the expected development of the Business; and (iii) renewal of the Company’s current customer, supplier and other material agreements.</p>
                         <p>These statements are not guarantees of future performance and undue reliance should not be placed on them. Such forward-looking statements necessarily involve known and unknown risks and uncertainties, which may cause actual performance and financial results in future periods to differ materially from any projections of future performance or result expressed or implied by such forward-looking statements.  There can be no assurance that forward-looking statements will prove to be accurate, as actual results and future events could differ materially from those anticipated in such statements. Storage Exchange undertakes no obligation to update forward-looking statements if circumstances or management’s estimates or opinions should change except as required by applicable securities laws. The reader is cautioned not to place undue reliance on forward-looking statements.</p>
                         <p>This website may contain links to third-party websites that are not under the control of Storage Exchange. All brochures, projections, opinions, assumption or estimates used are examples only and are not represented as future performance of assets.</p>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Footer;