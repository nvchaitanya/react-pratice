import React, { Component } from 'react';
import { Row, Col, Button, Container } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../Utils/config';
import axios from 'axios';
import './Home.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import feature_home from './../../Assets/Img/noimglist.png';
import banner_src from './../../Assets/Img/logo-white.png';
import address_f from './../../Assets/Img/location-black.png';
import arrow_f from './../../Assets/Img/arrow.png';
import base64 from 'react-native-base64'
import { getFormattedInt } from "../../Utils/utils";
import { Carousel } from 'react-responsive-carousel';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      featuredListings: [],
      propertyNameList: [],
      userInput: undefined,
      showPropertyNameList: false,
    };
    this.getFeaturedListings = this.getFeaturedListings.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onKeyFocus = this.onKeyFocus.bind(this);

  }

  componentDidMount() {
    this.getFeaturedListings(4);
  }


  getFeaturedListings(noOfStores) {
    this.setState({ isLoading: true });
    axios.get(CONFIG.API_URL + 'home/featuredlistings/' + noOfStores).then(response => {
      if (response.status === 200) {
        this.setState({ featuredListings: response.data, isLoading: false });
      }
    })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  onSearchClick() {
    const { userInput } = this.state;

    const { from } = { from: { pathname: "/property/search/" + encodeURIComponent(userInput) } };
    this.props.history.push(from);
  }

  onKeyFocus() {
    const { showPropertyNameList } = this.state;
    this.setState({ showPropertyNameList: !showPropertyNameList });
  }


  handleKeyChange(e) {
    const userInput = e.currentTarget.value;

    this.setState({ userInput });
    if (userInput.length >= 2) {
      const data = {
        "Keyword": userInput,
        "StoreTypeID": null,
        "StateID": null,
        "PriceStart": null,
        "PriceEnd": null,
        "RentableSQFTStart": null,
        "RentableSQFTEnd": null,
        "City": null,
        "SortBy": null,
        "SortOrder": null,

      };
      axios.post(CONFIG.API_URL + 'home/property/search', data).then(response => {
        if (response.status === 200) {
          this.setState({ propertyNameList: response.data, showPropertyNameList: true });
        }
      })
        .catch(err => {
          this.setState({ isLoading: false });
        });
    }
  }

  render() {
    document.title = CONFIG.PAGE_TITLE + 'Home';
    const { isLoading, featuredListings, userInput, showPropertyNameList, propertyNameList } = this.state;

    return (
      <React.Fragment>
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div class="banner-sektion banner-overlay ">
          <Container-fluid>
            <div class="banner-heading ">
              <img src={banner_src} className="" alt="" />
              <h2>Data Driven. Value Focused.</h2>
              {/* <h4>Search Properties</h4> */}
              <div><span className="heading-broder"></span></div>
              <div class="header-form">
                <form>
                  <div class="form-box">
                    <React.Fragment>
                      <input type="text"
                        onChange={this.handleKeyChange}
                        onClick={this.onKeyFocus}
                        value={userInput} class="search-field business user-signin" placeholder="Enter Location, City or State" />

                      {showPropertyNameList && userInput ?
                        <React.Fragment>
                          <ul class="suggestions">
                            {propertyNameList.length > 1 ?
                              <React.Fragment>
                                {propertyNameList.map((property, index) => {
                                  if (index === 0) {
                                    // return (
                                    //   <li key={property.StoreID}>
                                    //     <span className="view-all"><Link onClick={this.onSearchClick}> {property.StoreName}</Link></span>
                                    //   </li>);
                                  } else {
                                    return (
                                      <li key={property.StoreID}>
                                        <span className="view-list-all"> <Link to={"/property/" + property.StoreID + "/" + encodeURIComponent(property.StoreName)} >{property.StoreName + "-" + property.City + "," + property.State}</Link></span>
                                      </li>
                                    );
                                  }

                                })}
                              </React.Fragment>
                              : <li class="no-suggestions">
                                <em><h6 className="no-records-found">No records found</h6></em>
                              </li>
                            }
                          </ul>

                        </React.Fragment>
                        : ''}
                    </React.Fragment>
                    <button class="search-btn" type="submit" disabled={propertyNameList.length <= 1}
                      onClick={this.onSearchClick}>Properties Search</button>
                  </div>
                </form>
              </div>
            </div>
          </Container-fluid>
        </div>
        {/* <PropertySearch /> */}
        <div className="home-featured page-height-fixed">
          <Row>
            <Col>
              <div className="heading">
                <h3>Current Listings</h3>
                {/* <div><span className="heading-broder"></span></div> */}
              </div>
            </Col>
          </Row>
          <Row>
            <div className="over-flow-y-home">
            {featuredListings.length > 0 ? featuredListings.map(stores => {
              return (
                <Col md={3} className="feature-box">
                  <div className="feature-home">
                    <div className="featured-offers-container">
                      <div className="featured-offer-col">
                        <div className="featured-offer-front">
                          <div className="featured-offer-photo">
                            {stores.StoreImages.length === 0 ? <img src={feature_home} alt="" />
                              : <div className="size img-slider-size">
                                <Carousel showThumbs={false} autoPlay={true}>
                                  {stores.StoreImages.map((image) =>
                                    <div>
                                      <img src={'/StoreImages/' + image.FileName} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} />
                                    </div>
                                  )}
                                </Carousel>
                              </div>
                            }
                            <div class="type-container">
                              {stores.StatusID == 3 ? <div class="estate-type">Under Contract</div> :
                                stores.StatusID == 1 ? <div class="transaction-type">On Sale</div> :
                                  <div class="sold-type">Sold</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="feature-details">
                        <h5><Link to={"/property/" + stores.StoreID + "/" + encodeURIComponent(stores.StoreName)}>{stores.StoreName}</Link></h5>
                        <ul className="listitem">
                          <li>
                            <div className="item">
                              <img src={address_f} alt="" />
                              <div class="content"> {stores.Address1},<br /> {stores.City}, {stores.State} <br />Zip Code: {stores.ZipCode}</div>
                            </div>
                          </li>
                        </ul>


                        <p>{stores.RentableSQFT ? stores.RentableSQFT + " Sq.Ft" : stores.Acerage + " Acre(s)"}</p>
                      </div>
                      <div className="featured-offer-params">
                        <div class="featured-area"> <p><Link to={"/property/" + stores.StoreID + "/" + encodeURIComponent(stores.StoreName)}>Read More</Link></p></div>
                      </div>
                      <div className="featured-price">
                        ${getFormattedInt(stores.Price)}
                      </div>
                    </div>
                  </div>
                </Col>
              )
            }) : <Col className="no-featured-stores">No featured properties found.</Col>}
            </div>
          </Row>
        </div>
      </React.Fragment >
    )
  }
}
