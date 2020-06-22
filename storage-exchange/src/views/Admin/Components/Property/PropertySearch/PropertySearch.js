import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter, ModalBody, Label, Container } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { PropertyUpload } from '../PropertyUpload';
import { CONFIG } from '../../../../../Utils/config';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
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
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import './PropertySearch.css';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteicon from '../../../../../Assets/Img/delete.png';
import restoreicon from '../../../../../Assets/Img/restore-icon.png';
import viewicon from '../../../../../Assets/Img/view.png';

import Geocode from "react-geocode";

registerPlugin(FilePondPluginFileValidateType);

const actionsStyles = theme => ({
  tablepaggination: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing * 2.5,
  },
});

const useStyles = withStyles({
  root: {
    width: 300,
  },
});

class Store extends React.Component {

  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };


  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.tablepaggination}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

const StoreWrapped = withStyles(actionsStyles, { withTheme: true })(
  Store,
);

const validateRentableSQFT = (value, ctx) => {
  if (isNaN(ctx.RentableSQFT)) {
    return "Rentable Square Feet should be a number";
  } else if (ctx.RentableSQFT <= 0 && ctx.RentableSQFT != "") {
    return "Rentable Square Feet should be greater than zero";
  }
  return true;
}
const propertyValidation = (value, ctx) => {
  if (ctx.PropertyTypeId == "0" || ctx.PropertyTypeId == "") {
    return "Property Type is required";
  }
  return true;
}

const validateAcreage = (value, ctx) => {
  if (isNaN(ctx.Acreage)) {
    return "Acreage should be a number";
  } else if (ctx.Acreage <= 0 && ctx.Acreage != "") {
    return "Acreage should be greater than zero";
  }
  return true;
}

const validatePrice = (value, ctx) => {
  if (ctx.Price.toString().trim() == "") {
    return "Property Value is required";
  }
  else if (isNaN(ctx.Price)) {
    return "Property Value should be a number";
  } else if (ctx.Price <= 0) {
    return "Price should be greater than zero";
  }
  return true;
}

export default class PropertySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchError: '',
      searchSellerError: '',
      properties: [],
      pageCount: 0,
      addModal: false,
      propertyTypes: [],
      states: [],
      documentTypes: [],
      stateId: 0,
      storeTypeId: 0,
      documentModal: false,
      uploadModal: false,
      mvpRadius: 0,
      storeId: 0,
      file: '',
      documentTypeId: 0,
      storeDocuments: [],
      description: '',
      sellers: [],
      sellerPageCount: 0,
      sellerCriteria: '',
      sellerPagination: '',
      sellerModal: false,
      sellerSelectionInProgress: false,
      sellerSelected: false,
      propertyCriteria: {
        StoreName: '',
        City: '',
        StatusID: 0,
        StateID: 0
      },
      propertyPagination: {
        Page: 1,
        PageLength: CONFIG.PAGE_LENGTH,
        TotalRecords: 0,
        TotalPages: 0
      },
      storeStatusList: [],
    };
    this.toggleDocumentModal = this.toggleDocumentModal.bind(this);
    this.toggleUploadModal = this.toggleUploadModal.bind(this);
    this.toggleSellerModalClose = this.toggleSellerModalClose.bind(this);
    this.valuetext = this.valuetext.bind(this);
    this.getStoreDocuments = this.getStoreDocuments.bind(this);
    this.getAllSellers = this.getAllSellers.bind(this);
    this.getSellers = this.getSellers.bind(this);
    this.handler1 = this.handler1.bind(this);
    this.setSeller = this.setSeller.bind(this);
    this.restoreStore = this.restoreStore.bind(this);
    this.saveProperty = this.saveProperty.bind(this);
    this.viewProperty = this.viewProperty.bind(this);
  }

  searchStoreStatusChange(e) {
    const { propertyCriteria } = this.state;
    propertyCriteria.StatusID = e.target.value;
    this.setState({ propertyCriteria })
  }

  stateChange(e) {
    var value = e.target.value;
    this.setState({ stateId: value })
  }

  searchStateChange(e) {

    const { propertyCriteria } = this.state;
    propertyCriteria.StateID = e.target.value;
    this.setState({ propertyCriteria })
  }

  storeTypeChange(e) {
    var value = e.target.value;
    this.setState({ storeTypeId: value })
  }

  descOnChange(e) {
    var value = e.target.value;
    this.setState({ description: value });
  }

  handler1() {
    this.getStoreDocuments();
  }

  searchSubmit(event, errors, values) {
    if (errors.length === 0) {
      const { propertyCriteria, propertyPagination } = this.state;
      propertyCriteria.StoreName = values.StoreName;
      propertyCriteria.City = values.City;

      propertyPagination.Page = 1;
      propertyPagination.PageLength = CONFIG.PAGE_LENGTH;

      this.setState({
        propertyCriteria,
        propertyPagination,
        isLoading: true
      }, () => {
        this.searchStores();
      });
    }
  }

  searchStores() {
    const { propertyCriteria, propertyPagination } = this.state;

    let data = {
      StoreName: propertyCriteria.StoreName,
      City: propertyCriteria.City,
      StatusID: propertyCriteria.StatusID,
      StateID: propertyCriteria.StateID,
      Page: propertyPagination.page,
      PageLength: propertyPagination.PageLength
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.post(CONFIG.API_URL + 'admin/stores', data)
      .then(response => {
        if (response.status === 200) {

          let result = response.data;
          this.setState({ isLoading: false, properties: result.Stores, propertyPagination: result.Pagination });

        }
      })
      .catch(err => {

        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const sighinerror = err.response.data;
          this.setState({ sighinerror });
        }
        else {
          const sighinerror = "Something went wrong.";
          this.setState({ sighinerror });
        }

      });
  }

  initialLookup() {
    axios.get(CONFIG.API_URL + 'lookup/propertylookup')
      .then(response => {
        if (response.status === 200) {
          let lookups = response.data;
          this.setState({ propertyTypes: lookups.storeTypes, states: lookups.states, documentTypes: lookups.documentTypes });

        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const sighinerror = err.response.data;
          this.setState({ sighinerror });
        }
        else {
          const sighinerror = "Something went wrong.";
          this.setState({ sighinerror });
        }

      });
  }

  addtoggleModal() {
    this.setState(state => ({ addModal: !state.addModal }))
  }

  toggleClose = () => {
    this.myFormRef && this.myFormRef.reset();
    this.setState(state => ({ addModal: false }))
  };

  toggleDocumentModal() {
    this.getStoreDocuments();
    this.setState(state => ({ documentModal: !state.documentModal, isLoading: false }));
  }

  documentModalClose = () => this.setState(state => ({ documentModal: false, isLoading: false }), () => {
    this.getAllSellers();
  });

  toggleUploadModal(documentTypeId) {
    this.setState(state => ({ uploadModal: !state.uploadModal, isLoading: false, documentTypeId: documentTypeId }));
  }

  toggleUploadClose = () => this.setState(state => ({ uploadModal: false, isLoading: false }));

  toggleSellerModal() {
    this.setState(state => ({ sellerModal: !state.sellerModal }));
  }

  toggleSellerModalClose = () => this.setState(state => ({ sellerModal: false, isLoading: false }), () => {
    this.getAllStores();
  });

  componentDidMount() {
    Geocode.setApiKey(CONFIG.GeolocationApiKey);
    Geocode.setLanguage("en");
    Geocode.enableDebug();

    if ((localStorage.getItem('accessKey') == null || localStorage.getItem('accessKey') == '' || localStorage.getItem('role') != 'Admin')) {
      this.props.history.push({
        pathname: "/admin"
      });
    }
    window.scrollTo(0, 0);
    this.getLookupStoreStatus();
    this.initialLookup();
    this.getAllStores();
  }

  resetSellerSearch() {
    this.formSeller && this.formSeller.reset();
    this.getAllSellers();
  }

  getLookupStoreStatus() {
    axios.get(CONFIG.API_URL + 'lookup/store/status').then(response => {
      if (response.status === 200) {
        this.setState({ storeStatusList: response.data, isLoading: false });
      }
    })
      .catch(err => {
        this.setState({ isLoading: false });
      });
  }

  getAllStores() {
    this.setState({
      propertyCriteria: {
        StoreName: '',
        City: '',
        StatusID: 0,
        StateID: 0
      },
      propertyPagination: {
        Page: 1,
        PageLength: CONFIG.PAGE_LENGTH,
        TotalRecords: 0,
        TotalPages: 0
      }
    }, () => {
      this.searchStores();
    }
    );
  }

  handleInit() {
  }

  saveProperty(event, errors, values, lat, lng) {

    if (errors.length === 0) {
      const data = {
        'StoreID': 0,
        'StoreName': values.StoreName,
        'Address1': values.Address1,
        'Address2': values.Address2,
        'City': values.City,
        'StateID': this.state.stateId,
        'ZipCode': values.ZipCode,
        'Country': values.Country,
        'Description': this.state.description,
        'StoreTypeID': this.state.storeTypeId,
        'RentableSQFT': values.RentableSQFT ? values.RentableSQFT.trim() : '',
        'Acerage': values.Acreage ? values.Acreage.trim() : '',
        'Price': values.Price ? values.Price.trim() : '',
        'IsRoomForExpansion': values.IsRoomForExpansion == '1' ? true : values.IsRoomForExpansion == '0' ? false : null,
        'IsFeatureListing': values.IsFeatureListing,
        "Latitude": lat,
        "Longitude": lng,
        'ISActive': true
      }
      let token = localStorage.getItem('accessKey');
      if (token) {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
      }
      axios.post(CONFIG.API_URL + 'admin/store', data)
        .then(response => {
          let storeId = response.data.StoreID;
          this.setState({
            storeId: storeId, addModal: false, description: ''
          }, () => {

            this.toggleDocumentModal();
          });
        })
        .catch(err => {

          this.setState({ isLoading: false });
          if (err.response != null && err.response.status === 400) {
            const sighinerror = err.response.data;
            this.setState({ sighinerror });
          }
          else {
            const sighinerror = "Something went wrong.";
            this.setState({ sighinerror });
          }

        });
    }
  }

  addProperty(event, errors, values) {

    if (errors.length === 0) {
      var acreageError = "";
      if (values.Acreage.trim() == "" && values.RentableSQFT.trim() == "") {
        acreageError = 'Acreage or Rentable Square Feet is required';
      } else {
        if (values.Acreage.trim() != "" && isNaN(values.Acreage)) {
          acreageError = "Acreage should be a number";
        } else if (values.RentableSQFT.trim() != "" && isNaN(values.RentableSQFT)) {
          acreageError = "Rentable Square Feet should be a number";
        }
      }

      this.setState({ acreageError });
      if (acreageError == "") {
        const { states, stateId } = this.state;
        var state = states.filter(s => s.ID == stateId);

        var address = values.Address1 + "," + values.City + "," + state[0].Name + "," + values.Country;
        Geocode.fromAddress(address).then(
          response => {
            const { lat, lng } = response.results[0].geometry.location;
            this.saveProperty(event, errors, values, lat, lng);
          },
          error => {
            console.error(error);
            this.saveProperty(event, errors, values, "", "");
          }
        );
      }
    }
  }

  getStoreDocuments() {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    let storeId = this.storeId != undefined ? this.storeId : this.state.storeId;
    axios.get(CONFIG.API_URL + 'admin/store/documents/' + storeId)
      .then(response => {

        let storeDocuments = response.data;
        this.setState({ storeDocuments: storeDocuments, uploadModal: false }, () => {
          //this.toggleDocumentModal();
        });
      })
      .catch(err => {

        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const sighinerror = err.response.data;
          this.setState({ sighinerror });
        }
        else {
          const sighinerror = "Something went wrong.";
          this.setState({ sighinerror });
        }

      });
  }

  getAllSellers() {
    let data = {
      CompanyName: '',
      City: '',
      State: '',
      StoreID: this.state.storeId,
      Page: 1,
      PageLength: CONFIG.PAGE_LENGTH,
      SortBy: 'FirstName',
      SortOrder: 'ASC'
    }

    this.getSellers(data);
  }

  searchSellers(event, errors, values) {
    if (errors.length === 0) {
      const params = {
        'CompanyName': values.CompanyName,
        'City': values.City,
        'State': values.State,
        'StoreId': this.state.storeId,
        'Page': 1,
        'PageLength': CONFIG.PAGE_LENGTH,
        'SortBy': 'FirstName',
        'SortOrder': 'ASC'
      }

      this.getSellers(params);
    }
  }

  getSellers(data) {
    if (data == null) {
      data = this.state.sellerCriteria;
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    this.setState({ searchSellerError: '' });

    axios.post(CONFIG.API_URL + 'admin/sellers', data)
      .then(response => {

        let result = response.data;
        this.setState({
          sellers: result.Sellers, sellerCriteria: result.Criteria, sellerPagination: result.Pagination,
          sellerModal: true
        });
      })
      .catch(err => {

        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const searchSellerError = err.response.data;
          this.setState({ searchSellerError });
        }
        else {
          const searchSellerError = "Something went wrong.";
          this.setState({ searchSellerError });
        }

      });
  }

  setSeller(sellerId) {

    this.setState({ sellerSelectionInProgress: true });
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    let data = {
      SellerId: sellerId,
      StoreIds: [this.state.storeId]
    }

    axios.post(CONFIG.API_URL + 'admin/seller/store', data)
      .then(response => {

        this.setState({
          sellerSelected: true
        }, () => {
          this.toggleSellerModalClose();
        });
      })
      .catch(err => {

        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const searchSellerError = err.response.data;
          this.setState({ searchSellerError, sellerSelectionInProgress: false });
        }
        else {
          const searchSellerError = "Something went wrong.";
          this.setState({ searchSellerError, sellerSelectionInProgress: false });
        }

      });
  }

  valuetext(value) {
    if (value != this.state.mvpRadius) {
      // 
      const data = {
        'StoreID': this.state.storeId,
        'MVPRadius': value
      };
      let token = localStorage.getItem('accessKey');
      if (token) {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
      }
      axios.post(CONFIG.API_URL + 'admin/store/radius', data)
        .then(response => {
          if (response.status === 200) {
            let mvpRadius = value;
            this.setState({ mvpRadius: mvpRadius }, () => {
              setTimeout(mvpRadius = value, 500);
            });
          }
        })
        .catch(err => {

          if (err.response != null && err.response.status === 400) {
            const sighinerror = err.response.data;
            this.setState({ sighinerror });
          }
          else {
            const sighinerror = "Something went wrong.";
            this.setState({ sighinerror });
          }
        });
    }

    return `$${value}`;
  }

  resetSearch() {
    this.myFormSearch && this.myFormSearch.reset();
    this.getAllStores();
  }


  viewProperty(storeId) {
    const { from } = { from: { pathname: '/admin/property/' + storeId } };
    this.props.history.push(from);
  }

  handleChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.propertyPagination.page = pageCount + 1;
    this.searchStores();
  };

  handleSellerChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.sellerCriteria.page = pageCount + 1;
    this.getSellers(null);
  };

  handleChangeRowsPerPageTrack = event => {
    this.setState({ pageCount: 0, 10: event.target.value });
  };

  deleteStore = (storeId) => {
    confirmAlert({
      title: 'Delete Store',
      message: 'Are you sure want to delete this store?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.request({
              url: CONFIG.API_URL + 'admin/store/' + storeId,
              method: 'delete',
            })
              .then(res => {
                this.searchStores();
              })
              .catch(err => {

                this.setState({ isLoading: false });
                if (err.response != null && err.response.status === 400) {
                  const searchError = err.response.data;
                  this.setState({ searchError });
                }
                else {
                  const searchError = "Something went wrong.";
                  this.setState({ searchError });
                }
              });
          }
        },
        {
          label: 'No'
          //onClick: () => alert('Click No')
        }
      ]
    });
  };

  restoreStore(storeId) {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.request({
      url: CONFIG.API_URL + 'admin/store/' + storeId,
      method: 'put',
    })
      .then(res => {
        this.searchStores();
      })
      .catch(err => {

        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const searchError = err.response.data;
          this.setState({ searchError });
        }
        else {
          const searchError = "Something went wrong.";
          this.setState({ searchError });
        }
      });
  }

  render() {
    document.title = CONFIG.PAGE_TITLE + 'Property Listings';
    const { isLoading, description, searchError, properties, pageCount, states, propertyTypes, documentTypes, storeDocuments,
      sellers, sellerPageCount, sellerCurrentPage, searchSellerError, sellerSelectionInProgress, sellerSelected, propertyPagination,
      propertyCriteria, storeStatusList, acreageError } = this.state;

    return (
      <main className="dashboard-layout-height background-clr-admin">
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div className="property-search-list">
          {/* <PropertyAdd
          isOpen={this.state.isModalOpen}
          toggle={this.state.isModalOpen}
        /> */}
          <div className="property-listing-dashboard leftandright-nomargin">
            <div className="heading">
              <h5>Property Listing</h5>
              {/* <div><span className="heading-broder"></span></div> */}
            </div>
            <div className="property-search-form form-back-shadow ">
              <AvForm onSubmit={this.searchSubmit.bind(this)} ref={c => (this.myFormSearch = c)}>
                <Row>
                  <Col md={3}>
                    <AvField name="StoreName" label="Store Name" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField name="City" label="City" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField type="select" name="State" value={propertyCriteria.StateID}
                      onChange={(e) => this.searchStateChange(e)}
                      label="State">
                      <option value="0">--Select--</option>
                      {states ? states.map(n => {
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
                  <Col md={3}>
                    <AvField type="select" name="State" value={propertyCriteria.StatusID}
                      onChange={(e) => this.searchStoreStatusChange(e)}
                      label="Status"
                    >
                      <option value="0">--Select--</option>
                      {storeStatusList ? storeStatusList.map(n => {
                        return (
                          <option key={n.ID}
                            value={n.ID}>
                            {n.Name}
                          </option>
                        );
                      }) : ''}
                    </AvField>
                  </Col>
                  <Col md={12}>
                    <Button className="search-butn" color="primary">Search</Button>
                    <Button onClick={this.resetSearch.bind(this)} className="btn-reset">Reset</Button>
                    <span className="sign-error">{searchError}</span>
                  </Col>
                </Row>
              </AvForm>
            </div>
          </div>

          <Row>
            <Col md={6} className="total-numb">
              {properties.length > 0 ? <p>Total Property Listings: {propertyPagination.TotalRecords}</p> : ''}
            </Col>
            <Col md={6} className="add-new-btn">
              <Link onClick={this.addtoggleModal.bind(this)} >[+] Add New Property</Link>
              {/* <Button onClick={this.toggleDocumentModal} >Add nested</Button> */}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="overflow-scroll-table br-0 table-model">
                {properties.length > 0 ?
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Property Name</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Zip</TableCell>
                        <TableCell>Seller</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {properties ? properties.map((record) =>
                        <TableRow key={record.StoreID}>
                          <TableCell>{moment(record.CreatedDate).format("L")}</TableCell>
                          <TableCell>{record.StoreName}</TableCell>
                          <TableCell>{record.City}</TableCell>
                          <TableCell>{record.StateName}</TableCell>
                          <TableCell>{record.ZipCode}</TableCell>
                          <TableCell>{record.SellerName}</TableCell>
                          <TableCell>{record.StatusID === 1 ? 'On Sale' : record.StatusID === 2 ? 'Sold' : 'Under Contract'}</TableCell>
                          <TableCell>
                            <Button className="no-button-background" onClick={() => this.viewProperty(record.StoreID)}><img src={viewicon} alt="view" title="View" /></Button>
                            {
                              record.ISActive ?
                                <Button className="no-button-background" onClick={() => this.deleteStore(record.StoreID)}><img src={deleteicon} alt="delete" title="Delete" /></Button> :
                                <Button className="no-button-background" onClick={() => this.restoreStore(record.StoreID)}><img src={restoreicon} alt="restore" title="Restore" /></Button>
                            }
                          </TableCell>
                        </TableRow>
                      ) :
                        <TableRow></TableRow>
                      }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={1}
                          colSpan={8}
                          count={properties ? this.state.propertyPagination.TotalRecords : 0}
                          rowsPerPage={CONFIG.PAGE_LENGTH}
                          page={pageCount}
                          SelectProps={{
                            native: true,
                          }}
                          onChangePage={this.handleChangePageTrack}
                          onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                          ActionsComponent={StoreWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                  : <h6 className="no-records-found">No records found</h6>}
              </div>
            </Col>
          </Row>
          <Modal size="md" id="tst1" name="tst1" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
            <ModalHeader toggle={this.toggleClose.bind(this)}>Add New Property</ModalHeader>
            <ModalBody className="overflow-scroll basic-details">
              <AvForm onSubmit={this.addProperty.bind(this)} ref={c => (this.myFormRef = c)}>
                <Row>
                  <Col md={6}>
                    <AvField name="StoreName" label="Property Name:" type="text" maxLength="200" validate={{
                      required: { value: true, errorMessage: 'Property Name is required' }
                    }} />
                  </Col>
                  <Col md={6}>
                    <AvField name="Price" label="Property Value:" type="text" maxLength="9"
                      validate={{ numberValidation: validatePrice }}
                    />
                  </Col>
                  <Col md={6}>
                    <AvField name="Address1" label="Address Line 1:" maxLength="300"
                      validate={{
                        required: { value: true, errorMessage: 'Address Line 1 is required' }
                      }} />
                  </Col>
                  <Col md={6}>
                    <AvField name="Address2" label="Address Line 2:" maxLength="100" />
                  </Col>
                  <Col md={6}>
                    <AvField name="City" label="City:" maxLength="100" validate={{
                      required: { value: true, errorMessage: 'City is required' }
                    }} />
                  </Col>
                  <Col md={6}>
                    <AvField type="select" name="State" value={this.state.stateId}
                      onChange={(e) => this.stateChange(e)}
                      label="State:"
                      validate={{
                        required: { value: true, errorMessage: 'State is required' },
                      }}>
                      <option value="0">--Select--</option>
                      {states ? states.map(n => {
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
                    <AvField name="Country" label="Country:" maxLength="20" validate={{
                      required: { value: true, errorMessage: 'Country is required' }
                    }} />
                  </Col>
                  <Col md={6}>
                    <AvField name="ZipCode" label="Zip Code:" maxLength="20" validate={{
                      required: { value: true, errorMessage: 'Zip Code is required' }
                    }} />
                  </Col>
                  <Col md={6}>
                    <AvField type="select" name="PropertyTypeId" value={this.state.storeTypeId}
                      onChange={(e) => this.storeTypeChange(e)}
                      label="Property Type:"
                      validate={{
                        propertyValidation: propertyValidation
                      }} >
                      <option value="0">--Select--</option>
                      {propertyTypes ? propertyTypes.map(n => {
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
                    <AvField name="RentableSQFT" label="Rentable Sqare Feet:" maxLength="9"
                      validate={{ myValidation: validateRentableSQFT }}
                    />
                  </Col>
                  <Col md={6}>
                    <AvField name="Acreage" label="Acreage:" maxLength="9"
                      validate={{ myValidation: validateAcreage }}
                    />
                  </Col>
                  <Col md={6}>
                    <AvRadioGroup inline name="IsRoomForExpansion" className="room-for-expansion-font" label="Room For Expansion:">
                      <AvRadio label="Yes" value="1" />
                      <AvRadio label="No" value="0" />
                    </AvRadioGroup>
                  </Col>
                </Row>
                <Row>

                </Row>
                <Row>
                  <Col md={12} className="property-box">
                    <AvField type="checkbox" name="IsFeatureListing" label="Featured Listing:" />
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Label>Description:</Label>
                    <textarea onChange={(e) => this.descOnChange(e)} value={description} label="Description" className="property-description" />
                  </Col>
                </Row>
                <Row className="save-right">
                  <Col md={12}>
                    {acreageError ? <p className="error">{acreageError}</p> : ''}

                    <Button id="btn" className="next-btn submit-btn btn-design">Save</Button>
                    <Button className="btn-reset" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                  </Col>
                </Row>
              </AvForm>
            </ModalBody>
          </Modal>
          <Modal size="md" id="tst2" name="tst2" isOpen={this.state.documentModal} toggle={this.documentModalClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
            <ModalHeader toggle={this.documentModalClose.bind(this)}>Add New Property
            </ModalHeader>
            <ModalBody className="overflow-scroll basic-details">
              <div>
                <Typography id="discrete-slider" gutterBottom>
                  MVP Radius
                </Typography>
                <Slider className="radius-scroll"
                  defaultValue={this.state.mvpRadius}
                  getAriaValueText={this.valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="on"
                  step={1}
                  marks
                  min={1}
                  max={10}
                />
              </div>
              <div>
                <h2 className="documents-font-size">Documents</h2>
                <div className="table-scroll table-property-croll">
                  {documentTypes && documentTypes.length > 0 ?
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className="tabl-width-property">Document Name</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          documentTypes.map((document) =>
                            <TableRow key={document.ID}>
                              <TableCell className="tabl-width-property">{document.Name}</TableCell>
                              <TableCell>
                                {
                                  storeDocuments && storeDocuments.length > 0 ?
                                    storeDocuments.some(doc =>
                                      (doc.DocumentTypeID == document.ID)) ?
                                      storeDocuments.map((doc) =>
                                        doc.DocumentTypeID == document.ID ?
                                          <label>{doc.FileName}</label>
                                          : ''
                                      )
                                      :
                                      <PropertyUpload parentMethod={this.handler1} storeId={this.state.storeId} documentId={document.ID} />
                                    // <button onClick={() => this.toggleUploadModal(document.ID)}>upload</button>
                                    :
                                    <PropertyUpload parentMethod={this.handler1} storeId={this.state.storeId} documentId={document.ID} />
                                  //<button onClick={() => this.toggleUploadModal(document.ID)}>upload</button>
                                }

                              </TableCell>
                            </TableRow>
                          )
                        }
                      </TableBody>
                    </Table>
                    : ''
                  }
                </div>
                <Modal size="md" id="tst3" name="tst3" isOpen={this.state.uploadModal} toggle={this.toggleUploadClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                  <ModalHeader toggle={this.toggleUploadClose.bind(this)}>Add New Property
                  </ModalHeader>
                  <ModalBody className="overflow-scroll basic-details">
                    <FilePond ref={ref => this.pond = ref}
                      files={this.state.files}
                      allowMultiple={false}
                      allowFileTypeValidation={true}
                      allowImagePreview={false}

                      //data-max-file-size="1MB"
                      allowFileSizeValidation={true}
                      maxFileSize='1MB'
                      maxTotalFileSize='1MB'
                      labelMaxFileSizeExceeded='File is too large'
                      labelMaxFileSize='Maximum file size is 1MB'
                      //acceptedFileTypes={['file/xls', 'file/xl', 'file/xlsl']}
                      labelIdle="Drag & Drop your Document OR Browse"
                      //accept="*"
                      // maxFiles={3}
                      server={{
                        url: CONFIG.API_URL + 'admin/upload',
                        timeout: 7000,
                        process: (fieldName, file, metadata, load, error, progress, abort, template) => {

                          // fieldName is the name of the input field
                          // file is the actual file object to send
                          const formData = new FormData();
                          formData.append('file', file, file.name);
                          formData.append('StoreID', this.state.storeId);
                          formData.append('DocumentTypeID', this.state.documentTypeId);

                          const request = new XMLHttpRequest();
                          let token = localStorage.getItem('accessKey');
                          request.open('POST', CONFIG.API_URL + 'admin/upload/document');

                          // Should call the progress method to update the progress to 100% before calling load
                          // Setting computable to false switches the loading indicator to infinite mode
                          request.upload.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                          };

                          // Should call the load method when done and pass the returned server file id
                          // this server file id is then used later on when reverting or restoring a file
                          // so your server knows which file to return without exposing that info to the client
                          request.onload = function (e) {
                            if (request.status >= 200 && request.status < 300) {

                              //e.pond.removeFiles();
                              const template = request.responseText;
                              // var logoJson = JSON.parse(request.responseText);


                              localStorage.setItem('template', template);
                              //console.log(template);
                              // the load method accepts either a string (id) or an object
                              load(request.responseText);
                            }
                            else {
                              // Can call the error method if something is wrong, should exit after
                              error('oh no');
                            }
                          };
                          request.setRequestHeader('Authorization', 'Bearer ' + token);
                          request.send(formData);
                          // Should expose an abort method so the request can be cancelled
                          return {
                            abort: () => {
                              // This function is entered if the user has tapped the cancel button
                              request.abort();

                              // Let FilePond know the request has been cancelled
                              abort();
                            }
                          };
                        }
                      }
                      }
                      oninit={() => this.handleInit.bind(this)}
                      onupdatefiles={(fileItems) => {
                        // Set current file objects to this.state
                        this.setState({
                          files: fileItems.map(fileItem => fileItem.file)
                        });

                      }}
                      onprocessfiles={() => {

                        if (this.pond.getFiles().filter(x => x.status !== 5).length === 0) {
                          this.getStoreDocuments();
                        }
                        // setTimeout(() => {
                        //   
                        //   this.pond.element = null;
                        //   this.getStoreDocuments();
                        // }, 5000);
                      }}
                    >
                    </FilePond>
                  </ModalBody>

                </Modal>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.documentModalClose.bind(this)}>Next</Button>{' '}
            </ModalFooter>
          </Modal>
          <Modal size="md" id="mdSeller" name="mdSeller" backdrop="static" isOpen={this.state.sellerModal} toggle={this.toggleSellerModalClose.bind(this)} className="create-new edit-market-dashboard">
            <ModalHeader toggle={this.toggleSellerModalClose.bind(this)}>Assign Seller
                  </ModalHeader>
            <ModalBody className="overflow-scroll basic-details">

              <AvForm onSubmit={this.searchSellers.bind(this)} ref={c => (this.formSeller = c)}>
                <Row>
                  <Col md={6}>
                    <AvField name="CompanyName" label="First Name" type="text" />
                  </Col>
                  <Col md={6}>
                    <AvField name="City" label="City" type="text" />
                  </Col>
                  <Col md={12} className="save-right">
                    <Button color="primary" >Search</Button>
                    <Button className="btn-reset" onClick={this.resetSellerSearch.bind(this)}>Reset</Button>
                    <span className="sign-error">{searchSellerError}</span>
                  </Col>
                </Row>
                {/* <AvField name="State" label="State" type="text" /> */}
              </AvForm>

              <div className="table-scroll">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Select</TableCell>
                      <TableCell>First Name</TableCell>
                      <TableCell>Last Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sellers && sellers.length > 0 ? sellers.map((seller) =>
                      <React.Fragment>
                        <TableRow>
                          <TableCell>
                            {
                              sellerSelectionInProgress === false ?
                                <Button className="view-btn" onClick={() => this.setSeller(seller.ID)}>Select</Button>
                                :
                                <Label>Select</Label>
                            }
                          </TableCell>
                          <TableCell>{seller.FirstName}</TableCell>
                          <TableCell>{seller.LastName}</TableCell>
                          <TableCell>{seller.Email}</TableCell>
                          <TableCell>{seller.StateName}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                      :
                      <React.Fragment>
                        <TableRow>
                          <TableCell colSpan="5">
                            <h6 className="no-records-found">No sellers found</h6>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    }
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={1}
                        colSpan={8}
                        count={sellers ? this.state.sellerPagination.TotalRecords : 0}
                        rowsPerPage={CONFIG.PAGE_LENGTH}
                        page={pageCount}
                        SelectProps={{
                          native: true,
                        }}
                        onChangePage={this.handleSellerChangePageTrack}
                        onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                        ActionsComponent={StoreWrapped}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </ModalBody>
          </Modal>

        </div>
      </main >
    );
  }
}
