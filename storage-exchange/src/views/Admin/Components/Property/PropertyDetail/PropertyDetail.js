import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter, ModalBody, Label, FormGroup, Container } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { PropertyUpload } from '../PropertyUpload';
import { CONFIG, PROPERTYSTATUS } from '../../../../../Utils/config';
import { getFormattedInt } from "../../../../../Utils/utils";
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './PropertyDetail.css';
import { FilePond, registerPlugin } from 'react-filepond';
import edit_r from '../../../../../Assets/Img/edit-buy.png';
import arrow_r from '../../../../../Assets/Img/arrow-right.png';
import upload_r from '../../../../../Assets/Img/upload.png';
import 'filepond/dist/filepond.min.css';
import user_icon from '../../../../../Assets/Img/user-detail.png';
import status_icon from '../../../../../Assets/Img/status-details.png';
import address_icon from '../../../../../Assets/Img/location-details.png';
import phone_icon from '../../../../../Assets/Img/phone-details.png';
import mail_add from '../../../../../Assets/Img/mail-details.png';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import deleteicon from '../../../../../Assets/Img/delete.png';
import vendor_no from '../../../../../Assets/Img/ventor-list.png';
import view_icon from '../../../../../Assets/Img/view.png';
import editicon from '../../../../../Assets/Img/edit.png';
import feature_home from '../../../../../Assets/Img/noimglist.png';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';

import { DealViewModal } from '../../Shared/DealView';

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

class Property extends React.Component {
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

const PropertyWrapped = withStyles(actionsStyles, { withTheme: true })(
  Property,
);

const validateRentableSQFT = (value, ctx) => {
  if (isNaN(ctx.RentableSQFT)) {
    return "Rentable Square Feet should be a number";
  } else if (ctx.RentableSQFT <= 0 && ctx.RentableSQFT != "") {
    return "Rentable Square Feet should be greater than zero";
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

const propertyValidation = (value, ctx) => {
  if (ctx.PropertyTypeId == "0" || ctx.PropertyTypeId == "") {
    return "Property Type is required";
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

export default class PropertyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEdit: false,
      dealId: 0,
      storeId: 0,
      buyerId: 0,
      price: 0,
      statusId: 0,
      storeId: parseInt(this.props.match.params.propertyId),
      descError: '',
      store: '',
      storeEdit: '',
      seller: '',
      images: [],
      storeDeals: [],
      documents: [],
      documentTypes: [],
      pageCount: 0,
      addModal: false,
      propertyTypes: [],
      states: [],
      documentTypes: [],
      stateId: 0,
      storeTypeId: 0,
      nestedModal: false,
      descModal: false,
      formModal: false,
      mvpRadius: 0,
      file: '',
      documentTypeId: 0,
      storeDocuments: [],
      description: '',
      sellers: [],
      sellerPageCount: 0,
      sellerCriteria: '',
      sellerPagination: '',
      sellerModal: false,
      searchSellerError: '',
      sellerSelectionInProgress: false,
      status: [
        {
          "ID": 1,
          "Name": "Accept"
        },
        {
          "ID": 2,
          "Name": "Reject"
        },
        {
          "ID": 3,
          "Name": "Sold"
        }
      ]
    };
    this.getStore = this.getStore.bind(this);
    this.handler1 = this.handler1.bind(this);
    this.toggleDescModal = this.toggleDescModal.bind(this);
    this.toggleFormModal = this.toggleFormModal.bind(this);
    this.toggleSellerModalClose = this.toggleSellerModalClose.bind(this);
    this.valuetext = this.valuetext.bind(this);
    this.getAllSellers = this.getAllSellers.bind(this);
    this.getSellers = this.getSellers.bind(this);
    this.setSeller = this.setSeller.bind(this);
    this.getSellersAndShowModal = this.getSellersAndShowModal.bind(this);
    this.refreshImageSection = this.refreshImageSection.bind(this);
    this.deleteStoreDocument = this.deleteStoreDocument.bind(this);
    this.dealView = React.createRef();
  }

  stateChange(e) {
    var value = e.target.value;
    this.setState({ stateId: value })
  }

  storeTypeChange(e) {
    var value = e.target.value;
    this.setState({ storeTypeId: value })
  }

  descOnChange(e) {
    var value = e.target.value;
    this.setState({ description: value });
  }

  statusChange(e) {
    var value = e.target.value;
    this.setState({ statusId: value });
    this.updateDealStatus(value);
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

  updateDesc(event, errors, values) {
    if (errors.length === 0) {
      const data = {
        'Description': this.state.description,
        'StoreID': this.state.storeId
      }
      let token = localStorage.getItem('accessKey');
      if (token) {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
      }
      axios.post(CONFIG.API_URL + 'admin/store/desc', data)
        .then(response => {

          this.setState({
            descModal: false
          }, () => {
            this.getStore();
          });
        })
        .catch(err => {

          this.setState({ isLoading: false });
          if (err.response != null && err.response.status === 400) {
            const propertyError = err.response.data;
            this.setState({ propertyError });
          }
          else {
            const propertyError = "Something went wrong.";
            this.setState({ propertyError });
          }
        });
    }
  }
  // markFormGroupTouched(formGroup: FormGroup) {
  //   Object.keys(formGroup.controls).map(x => formGroup.controls[x]).forEach(control => {
  //     control.markAsTouched();

  //     if (control.controls) {
  //       this.markFormGroupTouched(control);
  //     }
  //   });
  // }
  updateProperty(event, errors, values) {
    //this.myFormRef.markAsTouched();
    const { isRoomForExpansion } = this.state;

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
        const data = {
          'StoreID': this.state.storeId,
          'StoreName': values.StoreName,
          'Address1': values.Address1,
          'Address2': values.Address2,
          'City': values.City,
          'StateID': this.state.stateId,
          'ZipCode': values.ZipCode,
          'Country': values.Country,
          'StoreTypeID': this.state.storeTypeId,
          'RentableSQFT': values.RentableSQFT ? values.RentableSQFT.trim() : '',
          'Acerage': values.Acreage ? values.Acreage.trim() : '',
          'Price': values.Price ? values.Price.trim() : '',
          'IsRoomForExpansion': isRoomForExpansion,
          'IsFeatureListing': values.IsFeatureListing,
          'ISActive': true
        }
        let token = localStorage.getItem('accessKey');
        if (token) {
          axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'admin/store', data)
          .then(response => {

            this.setState({
              formModal: false
            }, () => {

              this.getStore();
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
  }

  handler1() {
    this.getStore();
  }

  refreshImageSection() {
    this.getStoreImages();
  }

  getStoreImages() {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.get(CONFIG.API_URL + 'admin/storeimage/' + this.state.storeId)
      .then(response => {
        if (response.status === 200) {
          this.setState({ images: response.data });
        }
      }).catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const propertyError = err.response.data;
          this.setState({ propertyError });
        }
        else {
          const propertyError = "Something went wrong.";
          this.setState({ propertyError });
        }
      });
  }

  getStoreDeals(params) {
    this.setState({ isLoading: true });
    if (params == null) {
      params = this.state.storeDeals.Criteria;
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }

    axios.post(CONFIG.API_URL + 'admin/store/deals', params)
      .then(res => {
        let storeDeals = res.data;
        this.setState({ storeDeals, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
        console.log(err);
      })
  }

  removeStoreImage(image) {
    confirmAlert({
      title: 'Delete Image',
      message: 'Are you sure want to delete this image?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ isLoading: true });
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.delete(CONFIG.API_URL + 'admin/delete/image/' + image + "/" + this.state.storeId)
              .then(response => {
                if (response.status === 200) {
                  this.setState({ images: response.data, isLoading: false });
                }
              }).catch(err => {

                this.setState({ isLoading: false });
                if (err.response != null && err.response.status === 400) {
                  const imageError = err.response.data;
                  this.setState({ imageError });
                }
                else {
                  const imageError = "Something went wrong.";
                  this.setState({ imageError });
                }
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });

  }

  getStore() {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.get(CONFIG.API_URL + 'admin/store/' + this.state.storeId)
      .then(response => {
        if (response.status === 200) {

          let property = response.data;
          let isRoomForExpansion = property.Store.IsRoomForExpansion != null ? property.Store.IsRoomForExpansion.toString() : null;

          this.setState({
            isLoading: false, store: property.Store, storeEdit: property.Store, stateId: property.Store.StateID, storeTypeId: property.Store.StoreTypeID, seller: property.Seller,
            images: property.ListedImages, documents: property.Documents, documentTypes: property.DocumentTypes,
            description: property.Store.Description, mvpRadius: property.Store.MVPRadius, isRoomForExpansion: isRoomForExpansion
          }, () => {
            const { storeEdit } = this.state;

            storeEdit.Price = storeEdit.Price.toString();
            storeEdit.Acreage = storeEdit.Acerage ? storeEdit.Acerage.toString() : '';
            storeEdit.RentableSQFT = storeEdit.RentableSQFT ? storeEdit.RentableSQFT.toString() : '';
            this.setState({ storeEdit });
          });
        }
      })
      .catch(err => {

        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const propertyError = err.response.data;
          this.setState({ propertyError });
        }
        else {
          const propertyError = "Something went wrong.";
          this.setState({ propertyError });
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
          const propertyError = err.response.data;
          this.setState({ propertyError });
        }
        else {
          const propertyError = "Something went wrong.";
          this.setState({ propertyError });
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

  toggleNestedModal() {
    this.getStoreDocuments();
    this.setState(state => ({ nestedModal: !state.nestedModal, isLoading: false }));
  }

  toggleNestedClose = () => this.setState(state => ({ nestedModal: false, isLoading: false }));

  toggleDescModal() {
    this.setState(state => ({ descModal: !state.descModal }));
  }

  toggleFormModalClose = () => this.setState(state => ({ formModal: false, isLoading: false }));

  toggleFormModal() {


    this.setState(state => ({ formModal: !state.formModal }));
  }

  toggleDescModalClose = () => this.setState(state => ({ descModal: false, isLoading: false }));

  toggleSellerModal() {
    this.setState(state => ({ sellerModal: !state.sellerModal }));
  }

  toggleSellerModalClose = () => this.setState(state => ({ sellerModal: false, sellerSelectionInProgress: false, isLoading: false }), () => {
    this.getStore();
  });

  getSellersAndShowModal() {
    this.getAllSellers();
    this.toggleSellerModal();
  }

  getAllSellers() {
    let data = {
      CompanyName: '',
      City: '',
      State: '',
      StoreID: this.state.storeId,
      Page: 1,
      PageLength: 10,
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

  editDeal = (id, storeId, buyerId, price) => {
    this.setState({ isEdit: true, dealId: id, storeId: storeId, buyerId: buyerId, price: price });
  };

  updateDealStatus = (statusId) => {
    confirmAlert({
      title: 'Update Deal Status',
      message: 'Are you sure want to update this deal status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ isLoading: true });
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }

            let endpoint = '';

            switch (statusId) {
              case 1:
                endpoint = "accept";
                break;

              case 2:
                endpoint = "reject";
                break;

              case 3:
                endpoint = "sold";
                break;

              default: break;
            }

            let data = {
              Id: this.state.dealId,
              StoreId: this.state.storeId,
              BuyerId: this.state.buyerId,
              Price: this.state.price
            }

            axios.post(CONFIG.API_URL + 'admin/deal/' + endpoint, data)
              .then(res => {
                this.setState({ isEdit: false, dealId: 0, storeId: 0, buyerId: 0, price: 0, isLoading: false });
                this.getStoreDeals(null);
              })
              .catch(err => {
                this.setState({ isEdit: false, dealId: 0, storeId: 0, buyerId: 0, price: 0, isLoading: false });
                console.log(err);
              });
          }
        },
        {
          label: 'No',
          onClick: () => {
            this.setState({ isEdit: false, dealId: 0, storeId: 0, buyerId: 0, price: 0 });
          }
        }
      ]
    });
  };

  componentDidMount() {
    if ((localStorage.getItem('accessKey') == null || localStorage.getItem('accessKey') == '' || localStorage.getItem('role') != 'Admin')) {
      this.props.history.push({
        pathname: "/admin"
      });
    }
    window.scrollTo(0, 0);
    this.getStore();
    this.initialLookup();
    this.initializeStoreDealParams();
    // this.searchStores(this.initialParam());
  }

  resetSearch() {
    this.formSeller && this.formSeller.reset();
    this.getAllSellers();
  }

  initializeStoreDealParams() {
    const params = {
      'StoreID': this.state.storeId,
      'PageLength': CONFIG.PAGE_LENGTH,
      'Page': 1
    }

    this.getStoreDeals(params);
  }

  initialParam() {
    const params = {
      'StoreName': '',
      'City': '',
      'State': '',
      'Status': ''
    }
  }

  handleInit() {


  }

  getStoreDocuments() {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    let storeId = this.storeId != undefined ? this.storeId : this.state.storeId;
    axios.get(CONFIG.API_URL + 'admin/store/documents/' + storeId)
      .then(response => {

        let documents = response.data;
        this.setState({ documents: documents, descModal: false }, () => {
          //this.toggleNestedModal();
        });
      })
      .catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const propertyError = err.response.data;
          this.setState({ propertyError });
        }
        else {
          const propertyError = "Something went wrong.";
          this.setState({ propertyError });
        }
      });
  }

  deleteStoreDocument(docId) {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    let storeId = this.storeId != undefined ? this.storeId : this.state.storeId;
    axios.delete(CONFIG.API_URL + 'admin/store/document/' + docId)
      .then(response => {
        this.getStoreDocuments();
      })
      .catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const propertyError = err.response.data;
          this.setState({ propertyError });
        }
        else {
          const propertyError = "Something went wrong.";
          this.setState({ propertyError });
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
            const propertyError = err.response.data;
            this.setState({ propertyError });
          }
          else {
            const propertyError = "Something went wrong.";
            this.setState({ propertyError });
          }

        });
    }

    return `$${value}`;
  }

  handleChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
  };

  handleDealChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.storeDeals.Criteria.page = pageCount + 1;
    this.getStoreDeals(null);
  };

  handleChangeRowsPerPageTrack = event => {
    this.setState({ pageCount: 0, 10: event.target.value });
  };

  roomExpansionChange = (e) => {
    this.setState({ isRoomForExpansion: e.target.value });
  }

  viewDeal(deal) {
    this.dealView.current.getDeal(deal);
  }


  render() {
    document.title = CONFIG.PAGE_TITLE + 'Property View';
    const { isLoading, isEdit, dealId, status, store, storeEdit, seller, images, pageCount, storeDeals, documents, states, propertyTypes, documentTypes, storeDocuments,
      descError, description, searchSellerError, sellers, sellerSelectionInProgress, acreageError, imageError, isRoomForExpansion } = this.state;

    return (
      <main className="dashboard-layout-height background-clr-admin">
        <DealViewModal ref={this.dealView} />
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div className="property-details-list">
          {/* <PropertyAdd
          isOpen={this.state.isModalOpen}
          toggle={this.state.isModalOpen}
        /> */}

          <div className="leftandright-nomargin">
            {
              store ?
                <React.Fragment>
                  <Row className="property-details-admin">
                    <Col md={8}>
                      <div className="heading">
                        <h5>{store.StoreName}<span><Link onClick={() => this.toggleFormModal()}><img src={edit_r} className=" img-icon-buy " title="Edit" alt="edit" /> Edit</Link></span></h5>
                        <div><span className="heading-broder"></span></div>
                      </div>

                    </Col>
                    <Col md={4} className="heading-right-buyer">
                      <h6><img src={arrow_r} className="buyer-img" alt="back" title="back to dashboard" /><Link to="/admin/properties" > Back to Dashboard</Link></h6>
                    </Col>
                    <h3></h3>
                    <Modal size="md" id="mdForm" name="mdForm" isOpen={this.state.formModal} toggle={this.toggleFormModalClose.bind(this)} className="create-new edit-market-dashboard">
                      <ModalHeader toggle={this.toggleFormModalClose.bind(this)}>
                        Update Property
                            </ModalHeader>
                      <ModalBody className="overflow-scroll basic-details">
                        <AvForm model={storeEdit} onSubmit={this.updateProperty.bind(this)} ref={c => (this.myFormRef = c)}>
                          <Row>
                            <Col md={6}>
                              <AvField name="StoreName" label="Property Name:" type="text" validate={{
                                required: { value: true, errorMessage: 'Property Name is required' },
                                maxLength: { value: 200 }
                              }} />
                            </Col>
                            <Col md={6}>
                              <AvField name="Price" label="Property Value:" type="text" maxLength="9"
                                validate={{ numberValidation: validatePrice }}
                              />
                            </Col>
                            <Col md={6}>
                              <AvField name="Address1" label="Address Line 1:" validate={{
                                required: { value: true, errorMessage: 'Property Value is required' },
                                maxLength: { value: 300 }
                              }} />
                            </Col>
                            <Col md={6}>
                              <AvField name="Address2" label="Address Line 2:" value={storeEdit.Address2} validate={{
                                maxLength: { value: 100 }
                              }} />
                            </Col>
                            <Col md={6}>
                              <AvField name="City" label="City:" value={storeEdit.City} validate={{
                                maxLength: { value: 100 }
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
                              <AvField name="Country" label="Country:" value={storeEdit.Country} validate={{
                                maxLength: { value: 20 }
                              }} />
                            </Col>
                            <Col md={6}>
                              <AvField name="ZipCode" label="Zip Code:" value={storeEdit.ZipCode} validate={{
                                maxLength: { value: 20 }
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
                              <AvField type="text" name="RentableSQFT" label="Rentable Sqare Feet:" maxLength="9"
                                value={storeEdit.RentableSQFT}
                                validate={{ myValidation: validateRentableSQFT }}
                              />
                            </Col>
                            <Col md={6}>
                              <AvField name="Acreage" label="Acreage:"
                                maxLength="9"
                                validate={{ myValidation: validateAcreage }}
                              />
                            </Col>
                            <Col md={6}>
                              {/* <AvRadioGroup className="room-for-expansion-font" inline name="IsRoomForExpansion" label="Room For Expansion:">
                                <AvRadio label="Yes" value="true" />
                                <AvRadio label="No" value="false" />
                              </AvRadioGroup> */}
                              <div className="radio-mui-group">
                                <div className="ch-ra-zip">Room For Expansion</div>
                                <div className="clear"></div>
                                <FormControlLabel control={<Radio
                                  checked={isRoomForExpansion === "true"}
                                  onChange={this.roomExpansionChange.bind(this)}
                                  value="true"
                                  name="IsRoomForExpansion"
                                />} label="Yes" />
                                <FormControlLabel control={<Radio
                                  checked={isRoomForExpansion === "false"}
                                  onChange={this.roomExpansionChange.bind(this)}
                                  value="false"
                                  name="IsRoomForExpansion"
                                />} label="No" />
                              </div>
                            </Col>
                            <Col md={6} className="property-box">
                              <AvField type="checkbox" name="IsFeatureListing" label="Featured Listing:" value={storeEdit.IsFeatureListing} />
                            </Col>
                            <Col md={12}>
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
                            </Col>
                          </Row>
                          <Row>
                            <Col md={12} className="save-right">
                              {acreageError ? <p className="error">{acreageError}</p> : ''}
                              <Button id="btn" className="next-btn submit-btn btn-design">Save</Button>
                              <Button className="btn-reset" onClick={this.toggleFormModalClose.bind(this)}>Cancel</Button>
                            </Col>
                          </Row>
                        </AvForm>
                      </ModalBody>

                    </Modal>
                    <Modal size="md" id="mdSeller" name="mdSeller" isOpen={this.state.sellerModal} toggle={this.toggleSellerModalClose.bind(this)} className="create-new edit-market-dashboard">
                      <ModalHeader toggle={this.toggleSellerModalClose.bind(this)}>
                        Assign Seller
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
                              <Button className="btn-reset" onClick={this.resetSearch.bind(this)}>Reset</Button>
                              <span className="sign-error">{searchSellerError}</span>
                            </Col>
                            {/* <AvField name="State" label="State" type="text" /> */}
                          </Row>
                        </AvForm>
                        <div className="table-scroll">
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell className="table-width-col">Select</TableCell>
                                <TableCell>FirstName</TableCell>
                                <TableCell>LastName</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>State</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sellers && sellers.length > 0 ? sellers.map((seller) =>
                                <React.Fragment>
                                  <TableRow>
                                    <TableCell className="table-width-col">
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
                                  ActionsComponent={PropertyWrapped}
                                />
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </div>
                      </ModalBody>

                    </Modal>
                  </Row>
                  <div className="container-padding-remove">
                    <Row>
                      <Col md={8} className="buyer-view-details">
                        <Row className="form-back-shadow">
                          <Col sm={12}>
                            <h4>Property Details</h4>
                          </Col>
                          <Col sm={6}>
                            <h5><span>Address</span></h5>
                            <h5><Label>{store.Address1} {store.Address2 ? `, ${store.Address2}` : ''}</Label></h5>
                            <h5><span>City and State</span></h5>
                            <h5><Label>{store.City ? ` ${store.City}` : ''}</Label></h5>
                            <h5><Label>{store.StateName ? ` ${store.StateName}` : ''}</Label></h5>
                            <h5><span>Zip Code</span></h5>
                            <h5><Label>{store.ZipCode ? ` ${store.ZipCode}` : ''}</Label></h5>
                          </Col>
                          <Col md={6}>
                            <h5><span>Date Listed:</span></h5>
                            <h5><Label>{moment(store.CreatedDate).format("L")}</Label></h5>
                            <h5><span>Value:</span></h5>
                            <h5><Label>${getFormattedInt(store.Price)}</Label></h5>
                            <h5><span>Status:</span></h5>
                            <h5><Label>{store.StatusID === PROPERTYSTATUS.Available ? 'On Sale' : store.StatusID === PROPERTYSTATUS.DueDiligence ? 'Under Contract' : 'Sold'}</Label></h5>
                            <h5><span>MVP Radius:</span></h5>
                            <h5><Label>{store.MVPRadius}</Label></h5>
                          </Col>
                        </Row>
                      </Col>
                      {
                        seller ?
                          <Col md={4} className="form-back-shadow buyer-view-details height-increase">
                            <p className="details-heading">Details</p>
                            <h5><span><img src={user_icon} className="img-bottom" alt="" /> Property Owner </span></h5>
                            <h5><Label>{seller.FirstName + " " + seller.LastName} <Link onClick={() => this.getSellersAndShowModal()}><img src={edit_r} className=" img-icon-buy " title="Edit" alt="edit" /> Edit</Link> </Label></h5>
                            <h5><span><img src={phone_icon} className="img-bottom" alt="" /> Phone:</span></h5>
                            <h5><Label>{seller.PhoneNumber}</Label></h5>
                            <h5><span><img src={mail_add} className="img-bottom" alt="" /> Email:</span></h5>
                            <h5><Label>{seller.Email}</Label></h5>
                            <h5><span><img src={status_icon} className="img-bottom" alt="" /> Status: {seller.IsActive ? 'Active' : 'Inactive'}</span></h5>
                          </Col>
                          : <Col md={4} className="form-back-shadow buyer-view-details height-increase">
                            <p className=""><Link className="assign-seller-button" onClick={() => this.getSellersAndShowModal()}>[+] Assign Seller</Link></p>
                          </Col>}
                    </Row>
                  </div>
                  {/*<Row className="property-details-field">
                    <Col md={8} className="property-detail-address">
                      <p><span>Date Listed:</span> {moment(store.CreatedDate).format("L")}</p>
                      <p><span>Value:</span> ${getFormattedInt(store.Price)}</p>
                      <p><span>Status:</span> {store.StatusID === 1 ? 'On Sale' : 'Sold'}</p>
                      <p><span>MVP Radius:</span> {store.MVPRadius}</p>
                    </Col>
                    {
                      seller ?
                        <Col md={4} className="property-detail-user">
                          <p className="details-heading">Details</p>
                          <p><img src={user_icon} className="img-bottom" alt="" /> <Link onClick={() => this.getSellersAndShowModal()}>{seller.FirstName + " " + seller.LastName}</Link> <img src={edit_r} className=" img-icon-buy " title="Edit" alt="edit" /></p>
                          <p><img src={phone_icon} className="img-bottom" alt="" /> Phone: {seller.PhoneNumber}</p>
                          <p><img src={mail_add} className="img-bottom" alt="" /> Email: {seller.Email}</p>
                          <p><img src={status_icon} className="img-bottom" alt="" /> Status: {seller.IsActive ? 'Active' : 'Inactive'}</p>
                        </Col>
                        : <Link onClick={() => this.getSellersAndShowModal()}>Assign Seller</Link>}
                  </Row>*/}
                  <div className="form-back-shadow">
                    <Row className="button-property-image">
                      <Col>
                        <h5>Listed Images <PropertyUpload parentMethod={this.refreshImageSection} storeId={this.state.storeId} documentId={0} /></h5>
                      </Col>
                    </Row>
                    <Row className=" box-shadow-border img-border-property">

                      {imageError ? <p>{imageError}</p> : ''}

                      {
                        images && images.length > 0 ?
                          images.map((image) =>
                            <Col md={2}>
                              <img className="img-size-propertydetails" src={'/StoreImages/' + image.FileName} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} alt={store.StoreName} />
                              <div class="type-container" onClick={() => this.removeStoreImage(image.ID)}><img src={deleteicon} alt="delete" title="Delete" /></div>
                            </Col>
                          )
                          : <Container><Row><Col md={12} className="img-center-property"><img src={vendor_no} ></img></Col></Row></Container>
                      }

                    </Row>

                    <Row className="property-details-description">
                      <Col md={12}>
                        <h5>Property Description <Link onClick={() => this.toggleDescModal()}><span><img src={edit_r} className=" img-icon-buy " title="Edit" alt="edit" /> Edit</span></Link></h5>
                        <pre>
                          {store.Description}
                        </pre>
                      </Col>
                      <Modal size="md" id="mdDisc" name="mdDisc" isOpen={this.state.descModal} toggle={this.toggleDescModalClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                        <ModalHeader toggle={this.toggleDescModalClose.bind(this)}>
                          Update Description
                            </ModalHeader>
                        <ModalBody className="overflow-scroll basic-details">

                          <AvForm onSubmit={this.updateDesc.bind(this)} ref={c => (this.form = c)}>
                            <Row>
                              <Col md={12}>
                                {/* <AvField name="Description" label="Description" type="text" /> */}
                                <textarea className="table-text-area" onChange={(e) => this.descOnChange(e)} value={description} />
                              </Col>
                              <Col md={12} className="save-right">
                                <Button color="primary" className="update-button-descripe">Update</Button>
                                <span className="sign-error">{descError}</span>
                              </Col>
                            </Row>
                          </AvForm>
                        </ModalBody>
                      </Modal>
                    </Row>

                    <Row>
                      <Col md={12} className="table-model table-padding heading-table-name">
                        <h5>Deal Information</h5>
                        {storeDeals.Deals && storeDeals.Deals.length > 0 ?
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Deal Name</TableCell>
                                <TableCell>Buyer</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Proposed</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {storeDeals.Deals ? storeDeals.Deals.map((deal) =>
                                <TableRow key={deal.ID}>
                                  <TableCell>{moment(deal).format("L")}</TableCell>
                                  <TableCell>{deal.DealName} </TableCell>
                                  <TableCell>{deal.Buyer}</TableCell>
                                  <TableCell>{deal.City}</TableCell>
                                  <TableCell>{deal.State}</TableCell>
                                  <TableCell>${deal.Price}</TableCell>
                                  <TableCell>
                                    {isEdit == true && dealId === deal.ID ?
                                      <Select labelId="demo-simple-select-filled-label" className="select-deal" id="demo-simple-select-filled"
                                        value={this.state.statusId} onChange={(e) => this.statusChange(e)}>
                                        <MenuItem value="0">-Select-</MenuItem>
                                        {status ? status.map(n => {
                                          return (
                                            <MenuItem key={n.ID} className={n.ID === '' ? "optHead" : ''}
                                              disabled={n.ID === '' ? true : false}
                                              value={n.ID}>
                                              {n.Name}
                                            </MenuItem>
                                          );
                                        }) : ''}
                                      </Select>
                                      : deal.DealStatus
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {(deal.DealStatusID === 1 || deal.DealStatusID === 4) && store.StatusID !== 2 ?
                                      <Button className="no-button-background" onClick={() => this.editDeal(deal.ID, deal.StoreID, deal.BuyerID, deal.Price)}><img src={editicon} alt="edit" title="Edit" /></Button>
                                      : ''}
                                    <Button type="view" className="no-button-background" onClick={this.viewDeal.bind(this, deal)}><img src={view_icon} alt="view" title="View" /></Button>
                                  </TableCell>
                                </TableRow>
                              ) :
                                <TableRow></TableRow>
                              }
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TablePagination
                                  rowsPerPageOptions={[1]}
                                  colSpan={8}
                                  count={storeDeals.Deals ? storeDeals.Pagination.TotalRecords : 0}
                                  rowsPerPage={CONFIG.PAGE_LENGTH}
                                  page={pageCount}
                                  SelectProps={{
                                    native: true,
                                  }}
                                  onChangePage={this.handleChangePageTrack}
                                  onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                  ActionsComponent={PropertyWrapped}
                                />
                              </TableRow>
                            </TableFooter>
                          </Table>
                          : <h6 className="no-records-found no-found">No records found</h6>}
                      </Col>
                    </Row>

                    <Row>

                      <Col md={12} className="table-model table-padding heading-table-name">
                        <h5>Property Documents</h5>
                        {documentTypes && documentTypes.length > 0 ?
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Document</TableCell>
                                <TableCell>Uploaded Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {
                                documentTypes.map((document) =>
                                  <TableRow key={document.ID}>
                                    <TableCell>{document.Name}</TableCell>
                                    {
                                      documents && documents.length > 0 ?
                                        documents.some(doc =>
                                          (doc.DocumentTypeID == document.ID)) ?
                                          documents.map((doc) =>
                                            doc.DocumentTypeID == document.ID ?
                                              <React.Fragment>
                                                <TableCell>
                                                  {moment(doc.CreatedDate).format("L")}
                                                </TableCell>
                                                <TableCell>
                                                  Uploaded
                                            </TableCell>
                                                <TableCell>
                                                  <Link onClick={this.deleteStoreDocument.bind(this, doc.ID)}>Remove</Link>
                                                </TableCell>
                                              </React.Fragment>
                                              : ''
                                          )
                                          :
                                          <React.Fragment>
                                            <TableCell></TableCell>
                                            <TableCell>
                                              -
                                          </TableCell>
                                            <TableCell className="button-upload">
                                              <PropertyUpload parentMethod={this.handler1} storeId={this.state.storeId} documentId={document.ID} />
                                              {/* <button onClick={() => this.toggledescModal(document.ID)}>upload</button> */}
                                            </TableCell>

                                          </React.Fragment>
                                        :
                                        <React.Fragment>
                                          <TableCell></TableCell>
                                          <TableCell>
                                            -
                                        </TableCell>
                                          <TableCell className="button-upload">
                                            <PropertyUpload parentMethod={this.handler1} storeId={this.state.storeId} documentId={document.ID} />
                                            {/* <button onClick={() => this.toggledescModal(document.ID)}>upload</button> */}
                                          </TableCell>

                                        </React.Fragment>
                                    }

                                  </TableRow>
                                )
                              }
                            </TableBody>
                          </Table>
                          : ''
                        }
                      </Col>

                    </Row>
                  </div>
                </React.Fragment>
                : ''}

          </div>
        </div>
      </main >
    );
  }
}
