import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG, CONTACT, USERTYPES, PROPERTYSTATUS, DEALSTATUS } from '../../Utils/config';
import axios from 'axios';
import './PropertyView.css';
import { Input } from 'reactstrap';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import storage_src from './../../Assets/Img/storage-icon.png';
import address_icon from './../../Assets/Img/address.png';
import phone_icon from './../../Assets/Img/phone.png';
import mail_add from './../../Assets/Img/mail-add.png';
import noimg from './../../Assets/Img/noimg.png';
import feature_home from './../../Assets/Img/noimglist.png';
import { Carousel } from 'react-responsive-carousel';
import { getToken, getUserType, getbuyerStoreIDs } from '../../Utils/localStorage';
import { getFormattedInt } from '../../Utils/utils';

function Contact() {
  return (
    <React.Fragment>
      <h5>{CONTACT.Name}</h5>
      <ul className="listitem">
        <li>
          <div className="item">
            <img src={address_icon} className="" alt="" />
            <div class="content"> {CONTACT.Address1},<br />{CONTACT.Address2}, {CONTACT.City}<br />{CONTACT.State}, {CONTACT.Country} - {CONTACT.ZipCode}</div>
          </div>
        </li>
      </ul>
      <p> <img src={phone_icon} className="icon-size" alt="" /> : {CONTACT.ContactNo ? CONTACT.ContactNo : 'N/A'}</p>
      <p><img src={mail_add} className="icon-size" alt="" /> : {CONTACT.Email}</p>
    </React.Fragment >
  );

}

const validatePrice = (value, ctx) => {
  if (ctx.Price.toString().trim() == "") {
    return "Price is required";
  }
  else if (isNaN(ctx.Price)) {
    return "Price should be a number";
  } else if (ctx.Price <= 0) {
    return "Price should be greater than zero";
  }
  return true;
}

const validateEarnestMoneyDeposit = (value, ctx) => {
  if (ctx.EarnestMoneyDeposit.toString().trim() == "") {
    return "Earnest Money Deposit is required";
  }
  else if (isNaN(ctx.EarnestMoneyDeposit)) {
    return "Earnest Money Deposit should be a number";
  } else if (ctx.EarnestMoneyDeposit <= 0) {
    return "Earnest Money Deposit should be greater than zero";
  }
  return true;
}

export default class PropertyView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      NDAModal: false,
      propertyId: parseInt(this.props.match.params.propertyId),
      propertyData: [],
      imageNames: [],
      documentData: [],
      pageCount: 0,
      isHomePage: true,
      diligencePeriods: [],
      SEPrices: [],
      diligencePeriodsID: 0,
      SEPriceID: '0'

    };

    this.toggleNDAModal = this.toggleNDAModal.bind(this);
    //this.addDashBoard = this.addDashBoard.bind(this);
  }

  componentDidMount() {
    var propertyId = parseInt(this.props.match.params.propertyId);

    var token = getToken();
    var userType = getUserType();

    var isHomePage = true;

    if (this.props.location.pathname.indexOf("buyer/") > 0) {
      isHomePage = false;
    }
    this.setState({ token, userType, propertyId, isHomePage }, () => {
      this.getProperty();
    });

  }

  componentWillReceiveProps(nextprops) {

    let propertyId = parseInt(nextprops.match.params.propertyId)

    var token = getToken();
    var userType = getUserType();
    var isHomePage = true;

    if (this.props.location.pathname.indexOf("buyer/") > 0) {
      isHomePage = false;
    }
    this.setState({ token, userType, propertyId, isHomePage }, () => {
      this.getProperty();
    });
  }

  getPropertyPriceLookupValues() {

    axios.get(CONFIG.API_URL + 'lookup/propertypricelookup').then(response => {
      if (response.status === 200) {
        let data = response.data;
        this.setState({ SEPrices: data.SEPrices, diligencePeriods: data.diligencePeriods, isLoading: false });
      }
    })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  getProperty() {

    this.getPropertyPriceLookupValues();
    const { token, propertyId, userType } = this.state;

    this.setState({ isLoading: true });
    var url = CONFIG.API_URL + 'home/store/profile/' + propertyId;

    if (token) {//UnAuthenticated Property view

      var buyerStoreIds = getbuyerStoreIDs();//get Buyer storeIds from localStorage.
      var buyerStoreId = 0;

      if (buyerStoreIds) {
        buyerStoreIds.split(",").map(element => {
          let elementSplit = element.split("##");
          if (elementSplit[0] == propertyId) {
            buyerStoreId = elementSplit[1];
          }
        });

      }
      if (buyerStoreId != 0) {
        url = CONFIG.API_URL + 'buyer/store/profile/' + propertyId + '/' + buyerStoreId
      }
    }
    axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;

    axios.get(url)
      .then(res => {
        if (res.status === 200) {
          let propertyData = res.data.storeInfo;
          let documentData = res.data.documents;
          let imageNames = res.data.images;
          this.setState({ propertyData: propertyData, documentData: documentData, isLoading: false, imageNames: imageNames });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  download(fileName) {

  }

  submitOffer(event, errors, values) {
    if (errors.length === 0) {
      const { token, propertyData, isHomePage } = this.state;

      const data = {

        Store: {
          "StoreName": propertyData.StoreName,
          "Price": values.Price,
          "StoreID": propertyData.StoreID
        },
        BuyerStore: {
          "LOIName": values.Name,
          "LOICompanyName": values.Company,
          "SourceOfFinancing": values.SourceOfFinancing,
          "EarnestMoneyDeposit": values.EarnestMoneyDeposit,
          "DiligencePeriodID": values.diligencePeriodsID
        },
        "BuyerStoreID": propertyData.BuyerStoreID
      }

      this.setState({ isLoading: true });


      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
      axios.post(CONFIG.API_URL + 'buyer/store/deal/', data)
        .then(res => {
          if (!isHomePage) {
            document.getElementById("r1").click();
          }
          this.setState({ isLoading: false });
          this.props.history.push({
            pathname: "/buyer/dashboard"
          });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          if (err.response != null && err.response.status === 400) {
            const error = err.response.data;
            this.setState({ error });
          }
          else {
            const error = "Something went wrong.";
            this.setState({ error });
          }
        })
    }
  }

  toggleNDAModal = () => this.setState(state => ({ NDAModal: !state.NDAModal }));

  toggleClose = () => this.setState(state => ({ NDAModal: false }));

  addDashBoard(event, errors, values) {
    if (errors.length === 0) {
      const { token, propertyData } = this.state;

      const data = {
        'StoreID': propertyData.StoreID,
        'DealName': propertyData.StoreName,
        'NDAName': values.Name,
        'NDACompanyName': values.CompanyName
      }

      this.setState({ isLoading: true });
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;

      axios.post(CONFIG.API_URL + 'buyer/property/add/dashboard', data)
        .then(res => {
          this.setState({ isLoading: false });

          this.props.history.push({
            pathname: "/buyer/dashboard/"
          });
        })
        .catch((err) => {
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

  resetForm(event) {
    this.offerForm.reset();
  }

  signUp() {
    let propertyId = this.state.propertyId;
    let storeName = this.state.propertyData.StoreName;

    this.props.history.push({
      pathname: "/buyer-registration/" + propertyId + "/" + encodeURI(storeName)
    });
  }

  onSelectChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    document.title = CONFIG.PAGE_TITLE + 'Property Profile View';
    const { isLoading, propertyData, imageNames, documentData, pageCount,
      token, isHomePage, userType, diligencePeriods, SEPrices, diligencePeriodsID, SEPriceID } = this.state;
    return (
      <div >
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div class={!isHomePage ? "property-banner-condition" : "property-banner"} >
          <Container-fluid>
            <div className="item">
              <img src={storage_src} className="" alt="" />
              <div class="content">  <h2>PROPERTY DETAILS<br /> <span> <Link to="/">Home </Link>/ Property Details</span></h2></div>
            </div>
          </Container-fluid>
        </div>
        <div class={!isHomePage ? "property-detl-condition" : "property-detl"} >
          <Row>
            <Col>
              {/* Property Address and Image start */}
              <div className="heading">
                <h3>{propertyData.StoreName}</h3>
                {/* <div><span className="heading-broder"></span></div> */}
                <h5>{propertyData.Address1}, {propertyData.City}, {propertyData.StateName} -{propertyData.ZipCode}</h5>
              </div>
              <Row>
                <Col md={6} className="property_img">
                  {imageNames.length === 0 ? <img src={noimg} class={!isHomePage ? "noimg-condition" : "noimg-cls"} alt="" />

                    : <div className="size">
                      <Carousel showThumbs={false} autoPlay={true} className="image-carousel-size">
                        {imageNames ? imageNames.map((image) =>
                          <div>
                            {/* <img src={storeImages(`./` + image.FileName)} /> */}
                            <img src={'/StoreImages/' + image.FileName} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} />
                          </div>
                        ) : "No image"
                        }
                      </Carousel>
                    </div>
                  }
                </Col>
                {/* Property Address and Image end */}

                {/* Property Description start */}
                <Col md={6} className="property_des" >
                  <h3>Property <span>Description</span></h3>
                  <pre>{propertyData.Description ? propertyData.Description : 'N/A'}</pre>
                </Col>
                {/* Property Description end */}
              </Row>
              <Row>
                {/* Property Detail start */}
                <Col md={6} className={!isHomePage ? "property-dl-condition" : "property-dl padding-left-remove"}>
                  <h3 className="border-details">Details</h3>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <td><b>Ask Price</b></td>
                        <td>${getFormattedInt(propertyData.Price)} Million</td>
                      </tr>
                      {/* <tr>
                        <td><b>Property Type</b></td>
                        <td>{propertyData.StoreType ? propertyData.StoreType : 'N/A'}</td>
                      </tr> */}
                      <tr>
                        <td><b>Status</b></td>
                        <td>{propertyData.StoreStatus ? propertyData.StoreStatus : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><b>Rentable Square Feet</b></td>
                        <td>{propertyData.RentableSQFT ? propertyData.RentableSQFT + ' Sq.Ft' : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><b>Parcel Size</b></td>
                        <td>{propertyData.Acerage ? propertyData.Acerage + ' Acre(s)' : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td><b>Room for Expansion</b></td>
                        <td>{propertyData.IsRoomForExpansion == true ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <td><b>Days Listed</b></td>
                        <td>{propertyData.DaysListed ? propertyData.DaysListed <= 0 ? 0 : propertyData.DaysListed : 'N/A'} day(s)</td>
                      </tr>
                      <tr>
                        <td><b>Updated</b></td>
                        <td>{propertyData.ModifiedDate ? moment(propertyData.ModifiedDate).format("L") : moment(propertyData.CreatedDate).format("L")}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                {/* Property Detail end */}

                {/* Property Process start */}
                {propertyData.StatusID == PROPERTYSTATUS.Sold ?
                  <div className="col-md-6 add-margin">
                    <div className="cls-background-porperty">
                      <div class="sold-type large-size-tags">Sold</div>
                    </div>
                    <div className=" property-contact no-margin">
                      <div className="contact-details ">

                        <h3>Contact:</h3>

                        <div className="borker-contact">
                          <Contact />
                        </div>
                      </div>
                    </div>
                  </div>
                  : ''
                }

                {((propertyData.StatusID == PROPERTYSTATUS.Available || propertyData.StatusID == PROPERTYSTATUS.DueDiligence) && !propertyData.IsInterested) ? //Property Available so allow user to (add to dashboard) or register.
                  <div className="col-md-6 property-contact" >
                    <div className="contact-details">
                      <h3>Contact:</h3>
                      <div className="borker-contact">
                        <Contact />
                        {(!token) ? //not authenticated 
                          <React.Fragment>
                            <p className="para-msg-property">If you are interested in the property or willing to know more please click the button below and register</p>
                            <Button onClick={this.signUp.bind(this)} >Request Information</Button>
                          </React.Fragment>
                          : //authenticated
                          <React.Fragment>
                            {userType == USERTYPES.Buyer ?
                              <React.Fragment>
                                <p className="para-msg-property">If you are interested in the property or willing to know more please click the button below to add to your dashboard </p>
                                <Button onClick={this.toggleNDAModal} >Add to DashBoard</Button>
                              </React.Fragment> : ''
                            }
                          </React.Fragment>
                        }</div>
                    </div>
                  </div>
                  ://property available user interested
                  <React.Fragment>
                    {(token && userType == USERTYPES.Buyer && propertyData.StatusID == PROPERTYSTATUS.Available && propertyData.IsInterested && (propertyData.DealStatusID == DEALSTATUS.Evaluation || propertyData.DealStatusID == null || propertyData.DealStatusID == 0)) ?//property interested check deal added if yes show deal price else get deal price.
                      <React.Fragment>
                        <Col md={6} className={!isHomePage ? "property-contact-condition page-top-margin" : "property-contact page-top-margin"} >
                          {!propertyData.DealPrice ?// offer submit
                            <div className={!isHomePage ? "contact-details-condition" : "contact-details property-offer-form"} >
                              <h3>Your Offer:</h3>
                              <AvForm onSubmit={this.submitOffer.bind(this)} onReset={this.resetForm.bind(this)} ref={c => (this.offerForm = c)}>
                                <Row>
                                 
                                    <Col md={6}>
                                      <AvField name="Name" label="Name:" type="text" maxLength="200" validate={{
                                        required: { value: true, errorMessage: 'Name is required' }
                                      }} />
                                    </Col>
                                  
                                 
                                    <Col md={6}>
                                      <AvField name="Company" label="Company:" maxLength="300"
                                        validate={{
                                          required: { value: true, errorMessage: 'Company is required' }
                                        }} />
                                    </Col>
                                 
                                    <Col md={6}>
                                      <AvField name="Price" label="Price:"
                                        validate={{ myValidation: validatePrice }}
                                      />
                                    </Col>
                                 
                                    <Col md={6}>
                                      <AvField type="select" name="diligencePeriodsID" value={diligencePeriodsID}
                                        onChange={(e) => this.onSelectChange(e)}
                                        label="Diligence Period:"
                                        validate={{
                                          required: { value: true, errorMessage: 'Diligence Period is required' }
                                        }}
                                      >
                                        <option value="0">--Select--</option>
                                        {diligencePeriods ? diligencePeriods.map(n => {
                                          return (
                                            <option key={n.ID} className={n.ID === '' ? "optHead" : ''}
                                              disabled={n.ID === '' ? true : false}
                                              value={n.ID}>
                                              {n.Name}
                                            </option>
                                          );
                                        }) : ''}
                                      </AvField>
                                    </Col>
                                 
                                    <Col md={6}>
                                      <AvField name="SourceOfFinancing" label=" Source of Financing:" maxLength="300"
                                        validate={{
                                          required: { value: true, errorMessage: ' Source of Financing is required' }
                                        }} />
                                    </Col>
                                  
                                    <Col md={6}>
                                      <AvField name="EarnestMoneyDeposit" label="Earnest Money Deposit:" maxLength="300"
                                        validate={{ myValidation: validateEarnestMoneyDeposit }}
                                      />
                                    </Col>
                                 
                                  <Col sm={12} className="text-right-side">
                                    <Button className="btn-reset white-clr clear-btn-propertyview" type="reset">Clear</Button>
                                    <Button className="submt-offer" >Submit Offer</Button>
                                  </Col>
                                </Row>
                              </AvForm>
                              <Container-fluid><Row className="text-center-or"><Col>OR</Col></Row></Container-fluid>
                            </div>
                            :
                            <div className={!isHomePage ? "contact-details-condition margin-bottom-property" : "contact-details margin-bottom-property"}>
                              <h3> Deal Price : ${getFormattedInt(propertyData.DealPrice)}</h3>
                              <div className="deal-price-details">
                                <h3>Details</h3>
                                <Table>
                                  <tr>
                                    <td>Name</td>
                                    <td>:</td>
                                    <td><span>{propertyData.LOIName}</span></td>
                                  </tr>
                                  <tr>
                                    <td>Company Name</td>
                                    <td>:</td>
                                    <td><span>{propertyData.LOICompanyName}</span></td>
                                  </tr>
                                  <tr>
                                    <td>Source Of Financing</td>
                                    <td>:</td>
                                    <td><span>{propertyData.SourceOfFinancing}</span></td>
                                  </tr>
                                  <tr>
                                    <td>Diligence Period</td>
                                    <td>:</td>
                                    <td><span>{propertyData.DiligencePeriod}</span></td>
                                  </tr>
                                  <tr>
                                    <td>Earnest Money Deposit</td>
                                    <td>:</td>
                                    <td><span>${getFormattedInt(propertyData.EarnestMoneyDeposit)}</span></td>
                                  </tr>
                                </Table>

                              {/* <p>Name: {propertyData.LOIName}</p>
                              <p>Company Name: {propertyData.LOICompanyName}</p>
                              <p>Source Of Financing: {propertyData.SourceOfFinancing}</p>
                              <p>Diligence Period: {propertyData.DiligencePeriod}</p>
                              <p>Earnest Money Deposit: ${getFormattedInt(propertyData.EarnestMoneyDeposit)}</p> */}
                              </div>
                            </div>
                          }
                          <div className={!isHomePage ? "contact-details-condition" : "contact-details"}>
                            <h3>Contact:</h3>
                            <div className={!isHomePage ? "borker-contact-condition" : "borker-contact"}>
                              <Contact />
                            </div>
                          </div>
                        </Col>
                      </React.Fragment>
                      : ''}
                    {(token && userType == USERTYPES.Buyer && propertyData.StatusID == PROPERTYSTATUS.DueDiligence && propertyData.IsInterested && (propertyData.DealStatusID == DEALSTATUS.Accepted)) ?//Property under contract Deal submitted.

                      <Col md={6} className={!isHomePage ? "property-dl-condition" : "property-dl"} >
                        <h3 className="left-bor">Property Documents</h3>
                        <Table className="table custom-table table-bordered store-count-popup ">
                          <TableHead>
                            <TableRow>
                              <TableCell>Document Name</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {documentData.length > 0 ? documentData.slice(pageCount * 10, pageCount * 10 + 10).map((document) =>
                              <TableRow key={document.DocumentTypeID}>
                                <TableCell>{document.DocumentType}</TableCell>
                                <TableCell>
                                  <a target="_blank" rel="noopener noreferrer" href={'/StoreDocuments/' + document.FileName} download className="link-view">View</a>
                                </TableCell>
                              </TableRow>
                            ) :
                              <TableRow>
                                <td colspan="2" className="no-records-found">No documents available.</td></TableRow>
                            }
                          </TableBody>
                        </Table>
                        <div className={!isHomePage ? "property-contact-condition" : "property-contact"}>
                          <div className={!isHomePage ? "contact-details-condition" : "contact-details"}>
                            <h3>Contact:</h3>
                            <div className={!isHomePage ? "borker-contact-condition" : "borker-contact"}>
                              <Contact />
                            </div>
                          </div>
                        </div>
                      </Col>

                      : ''}
                    {(token && userType == USERTYPES.Buyer && propertyData.StatusID == PROPERTYSTATUS.DueDiligence && propertyData.IsInterested && (propertyData.DealStatusID == DEALSTATUS.OnHold)) ?//Property under contract Deal submitted but on hold.
                      <div className="col-md-6 add-margin">
                        <div className="cls-background-porperty">
                          <div class="estate-type large-size-tags">Under Contract</div>
                        </div>
                        <div className="property-contact property-contact-condition no-margin">
                          <div className={!isHomePage ? "contact-details-condition" : "contact-details"}>

                            <h3>Contact:</h3>

                            <div className={!isHomePage ? "borker-contact-condition" : "borker-contact"}>

                              <Contact />
                            </div>
                          </div>
                        </div>
                      </div>
                      : ''}
                  </React.Fragment>
                }
                {/* Property Process end */}
              </Row>
            </Col>
          </Row>
        </div >

        <Modal size="md" id="tst1" name="tst1" isOpen={this.state.NDAModal} toggle={this.toggleClose.bind(this)} className=" edit-market-dashboard">
          <ModalHeader toggle={this.toggleClose.bind(this)}>NDA Update:</ModalHeader>
          <ModalBody className="overflow-scroll basic-details">
            <AvForm onSubmit={this.addDashBoard.bind(this)} ref={c => (this.myFormRef = c)}>
              <Row>
                <Col md={12}>
                  <AvField name="Name" label="Name:" type="text" maxLength="200" validate={{
                    required: { value: true, errorMessage: 'Name is required' }
                  }} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AvField name="Company" label="Company:" maxLength="300"
                    validate={{
                      required: { value: true, errorMessage: 'Company is required' }
                    }} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <p>
                    Listing Agent: {propertyData.StoreName}, {propertyData.Address1}, {propertyData.City}, {propertyData.StateName} - {propertyData.ZipCode}
                  </p>
                </Col>
              </Row>
              <Row className="save-right">
                <Col md={12}>
                  <Button id="btn" className="next-btn submit-btn btn-design">Submit</Button>
                  <Button className="btn-reset" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                </Col>
              </Row>
            </AvForm>
          </ModalBody>
        </Modal>
      </div >
    );
  }
}
