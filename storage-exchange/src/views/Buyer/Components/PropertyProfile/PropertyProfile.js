import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { Input } from 'reactstrap';
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import './PropertyProfile.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import base64 from 'react-native-base64'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import moment from 'moment';


export default class PropertyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offerAmt: '',
      isLoading: false,
      propertyId: parseInt(this.props.match.params.propertyId),
      propertyData: [],
      imageName: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    
    let offerAmt = e.target.value;
    this.setState({ offerAmt: offerAmt });
  }

  componentDidMount() {
    
    this.getProperty();
  }
  submitOffer(){

  }
 
  getProperty() {
    
    this.setState({ isLoading: true });
    axios.get(CONFIG.API_URL + 'home/property/' + this.state.propertyId)
      .then(res => {
        if (res.status === 200) {
          
          let propertyData = res.data.storeInfo;
          //let imageName = res.data.imageName.FileName;
          this.setState({ propertyData: propertyData, isLoading: false });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }
  clearOffAmt(){
    
   this.state.offerAmt='';
  }
  
  render() {
    document.title = 'Storage Exchange';
    const { isLoading, propertyData, imageName, offerAmt } = this.state;
    
      return (
        <main className="dashboard-layout-height">
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div >          
          <h1>{propertyData.Address1},</h1>
          <p>{propertyData.City}, {propertyData.StateName} -{propertyData.ZipCode}</p>
          <p></p>
          <p>Area: {propertyData.RentableSQFT} Sq.Ft</p>
          <p><b>Value: ${propertyData.Price} Million</b></p>
          <h1>Property Description</h1>
          <p>{propertyData.Description}</p>
          <div>
            <img src='' />
          </div>
          <div>
            <p>Property Type {propertyData.StoreType}</p>
            <p>Status {propertyData.StoreStatus}</p>
            <p>Rentable Square Feet {propertyData.RentableSQFT}</p>
            <p>Acerage {propertyData.Acerage}</p>
            <p>Room For Expansion {propertyData.IsRoomForExpansion == true ? 'Yes' : 'No'}</p>
            <p>Days Listed </p>
            <p>Updated {propertyData.ModifiedDate ? moment(propertyData.ModifiedDate).format("L") : moment(propertyData.CreatedDate).format("L")}</p>
          </div>
          <div>
            Your Offer: <Input type="text" name="Offer" onChange={this.handleChange} value={offerAmt} />
            <br />
            <Button onClick={this.submitOffer}>Submit</Button>
            <Link onClick={this.clearOffAmt}>Clear</Link>
            <br />
            OR <br />
            Contact :
          </div>
        </div>
        </main>
      );
  }
}
