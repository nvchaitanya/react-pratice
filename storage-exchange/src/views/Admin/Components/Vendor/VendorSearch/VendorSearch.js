import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter, ModalBody, Container } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../../../../Utils/config';
import axios from 'axios';
import moment from 'moment';
import Checkbox from '@material-ui/core/Checkbox';
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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import './VendorSearch.css';
import feature_home from '../../../../../Assets/Img/noimglist.png';
import deleteicon from '../../../../../Assets/Img/delete.png';
import restoreicon from '../../../../../Assets/Img/restore-icon.png';
import editicon from '../../../../../Assets/Img/edit.png';

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

class Vendor extends React.Component {
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

const VendorWrapped = withStyles(actionsStyles, { withTheme: true })(
  Vendor,
);

export default class VendorSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      vendorError: '',
      vendor: '',
      vendorList: [],
      pageCount: 0,
      addModal: false,
      categoryModal: false,
      states: [],
      stateId: 0,
      searchStateId: 0,
      vendorId: 0,
      vendorLogo: '',
      childCategoryList: [],
      categoryId: [],
      selectedCategoryIDs: []
    };

    this.toggleCategoryModal = this.toggleCategoryModal.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
  }

  stateChange(e) {
    var value = e.target.value;
    this.setState({ stateId: value })
  }

  searchStateChange(e) {
    var value = e.target.value;
    this.setState({ searchStateId: value })
  }

  searchSubmit(event, errors, values) {
    if (errors.length === 0) {      
      const params = {
        'CompanyName': values.CompanyName,
        'City': values.City,
        'StateID': this.state.searchStateId,
        'PageLength': CONFIG.PAGE_LENGTH,
        'Page': 1
      }

      this.searchVendors(params);
    }
  }

  searchVendors(params) {
    this.setState({ isLoading: true });
    if (params == null) {
      params = this.state.vendorList.Criteria;
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }

    axios.post(CONFIG.API_URL + 'admin/vendors', params)
      .then(response => {
        if (response.status === 200) {
          let vendors = response.data;
          this.setState({ isLoading: false, vendorList: vendors });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const vendorerror = err.response.data;
          this.setState({ vendorerror });
        }
        else {
          const vendorerror = "Something went wrong.";
          this.setState({ vendorerror });
        }
      });
  }

  initialLookup() {
    axios.get(CONFIG.API_URL + 'lookup/state')
      .then(response => {
        if (response.status === 200) {
          let lookups = response.data;
          this.setState({ states: lookups });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const vendorerror = err.response.data;
          this.setState({ vendorerror });
        }
        else {
          const vendorerror = "Something went wrong.";
          this.setState({ vendorerror });
        }
      });
  }

  toggleAddModal() {
    this.setState(state => ({ addModal: !state.addModal, vendorId: 0, stateId: 0 }));

    let newVendor = {
      'VendorID': 0,
      'CompanyName': '',
      'Address1': '',
      'Address2': '',
      'City': '',
      'StateID': this.state.stateId,
      'ZipCode': '',
      'Country': '',
      'Description': '',
      'Website': '',
      'ISActive': true
    }
    this.setState(state => ({ vendor: newVendor }));
  }

  toggleUpdateModal(vendor) {
    this.setState(state => ({
      addModal: !state.addModal, vendorId: vendor.VendorID, vendor: vendor, vendorLogo: vendor.Logo
      , stateId: vendor.StateID, selectedCategoryIDs: vendor.VendorCategoryIDs ? vendor.VendorCategoryIDs.split(',').map(Number) : []
    }));
  }

  toggleClose = () => {
    this.myFormRef && this.myFormRef.reset();
    this.setState(state => ({ addModal: false }))
  };

  toggleCategoryModal() {
    //this.setState({ isLoading: true });
    const params = {
      'VendorID': this.state.vendorId,
      'Level': 2,
      'PageLength': CONFIG.PAGE_LENGTH,
      'Page': 1
    }

    this.getChildCategories(params);
    this.setState(state => ({ categoryModal: !state.categoryModal }));
  }

  toggleNestedClose = () => this.setState(state => ({ categoryModal: false }));

  componentDidMount() {
    if ((localStorage.getItem('accessKey') == null || localStorage.getItem('accessKey') == '' || localStorage.getItem('role') != 'Admin')) {
      this.props.history.push({
        pathname: "/admin"
      });
    }

    window.scrollTo(0, 0);
    this.initialLookup();
    this.searchVendors(this.initialParam());
  }

  initialParam() {
    const params = {
      'CompanyName': '',
      'City': '',
      'State': '',
      'Status': '',
      'Page': 1,
      'PageLength': CONFIG.PAGE_LENGTH
    }

    return params;
  }

  getChildCategories(params) {
    if (params == null) {
      params = this.state.childCategoryList.Criteria;
    }

    let token = localStorage.getItem('tokenKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.post(CONFIG.API_URL + 'admin/categories/level', params)
      .then(res => {
        let categoryList = res.data;
        this.setState({ childCategoryList: categoryList })
      })
      .catch((err) => {
        //this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const sighinerror = err.response.data;
          this.setState({ sighinerror });
        }
        else {
          const sighinerror = "Something went wrong.";
          this.setState({ sighinerror });
        }
      });

    this.setState(state => ({ addPropertyModal: !state.addPropertyModal }))
  }

  addVendor(event, errors, values) {
    if (errors.length === 0) {
      const data = {
        'VendorID': this.state.vendorId,
        'CompanyName': values.CompanyName,
        'Address1': values.Address1,
        'Address2': values.Address2,
        'City': values.City,
        'StateID': this.state.stateId,
        'ZipCode': values.ZipCode,
        'Country': values.Country,
        'Description': values.Description,
        'Website': values.Website,
        'Logo': this.state.vendorLogo,
        'ISActive': true
      }

      let token = localStorage.getItem('accessKey');
      if (token) {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
      }

      axios.post(CONFIG.API_URL + 'admin/vendor', data)
        .then(response => {
          if (this.state.vendorId === 0) {
            let vendorId = response.data.VendorID;
            this.setState({ addModal: false, vendorId }, () => { this.toggleCategoryModal(); });

          } else {
            this.setState({ addModal: false }, () => { this.toggleCategoryModal(); });
          }

        })
        .catch(err => {
          //this.setState({ isLoading: false });
          if (err.response != null && err.response.status === 400) {
            const vendorerror = err.response.data;
            this.setState({ vendorerror });
          }
          else {
            const vendorerror = "Something went wrong.";
            this.setState({ vendorerror });
          }
        });
    }
  };

  deleteVendor = (vendorId) => {
    confirmAlert({
      title: 'Delete Vendor',
      message: 'Are you sure want to delete this vendor?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.request({
              url: CONFIG.API_URL + 'admin/vendor/' + vendorId,
              method: 'delete',
            })
              .then(res => {
                this.searchVendors(null);
              })
              .catch(err => {
                //this.setState({ isLoading: false });
                if (err.response != null && err.response.status === 400) {
                  const vendorError = err.response.data;
                  this.setState({ vendorError });
                }
                else {
                  const vendorError = "Something went wrong.";
                  this.setState({ vendorError });
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

  restoreVendor(vendorId) {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.request({
      url: CONFIG.API_URL + 'admin/vendor/' + vendorId,
      method: 'put',
    })
      .then(res => {
        this.searchVendors(null);
      })
      .catch(err => {
        //this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const vendorError = err.response.data;
          this.setState({ vendorError });
        }
        else {
          const vendorError = "Something went wrong.";
          this.setState({ vendorError });
        }
      });
  }

  removeVendorLogo() {
    this.setState({ vendorLogo: '' });
    // confirmAlert({
    //   title: 'Delete Logo',
    //   message: 'Are you sure want to delete this logo?',
    //   buttons: [
    //       {
    //           label: 'Yes',
    //           onClick: () => {
    //             this.setState({ vendorLogo: '' });
    //           }
    //       },
    //       {
    //           label: 'No'
    //       }
    //   ]
    // });
  }

  processHandler = (fieldName, file, metadata, load, error, progress, abort, template) => {
    // fieldName is the name of the input field
    // file is the actual file object to send
    const formData = new FormData();
    formData.append('file', file, file.name);

    const request = new XMLHttpRequest();
    let token = localStorage.getItem('accessKey');
    let reqUrl = 'admin/upload/vendor/logo';
    request.open('POST', CONFIG.API_URL + reqUrl);

    // Should call the progress method to update the progress to 100% before calling load
    // Setting computable to false switches the loading indicator to infinite mode
    request.upload.onprogress = (e) => {
      progress(e.lengthComputable, e.loaded, e.total);
    };

    // Should call the load method when done and pass the returned server file id
    // this server file id is then used later on when reverting or restoring a file
    // so your server knows which file to return without exposing that info to the client
    request.onload = function () {
      if (request.status == 200) {
        const vendorLogo = request.responseText;
        this.setState({ vendorLogo: vendorLogo });
        // var logoJson = JSON.parse(request.responseText);

        //localStorage.setItem('vendorlogo', vendorlogo);
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
  
  onChangeCategory(e, categoryId) {
    if (e.target.checked) {
      this.state.selectedCategoryIDs.push(categoryId)
    }
    else {
      this.state.selectedCategoryIDs.splice(this.state.selectedCategoryIDs.indexOf(categoryId), 1);
    }

    let childCategories = this.state.childCategoryList.Categories;
    this.setState({ childCategories });
  }

  addVendorCategory() {
    const data = {
      "VendorID": this.state.vendorId,
      "CategoryIds": this.state.selectedCategoryIDs
    }

    let token = localStorage.getItem('tokenKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }

    axios.post(CONFIG.API_URL + 'admin/vendor/category', data)
      .then(res => {
        this.toggleNestedClose();
        this.state.vendorList.Criteria.Page = 1;
        this.searchVendors(null);
      })
      .catch((err) => {
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

  handleInit() {
  }

  resetSearch() {
    this.myFormSearch && this.myFormSearch.reset();
    this.searchVendors(this.initialParam());
  }

  handleChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.vendorList.Criteria.Page = pageCount + 1;
    this.searchVendors(null);
  };

  handleChildChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.childCategoryList.Criteria.Page = pageCount + 1;
    this.getChildCategories(null);
  };

  handleChangeRowsPerPageTrack = event => {
    this.setState({ pageCount: 0, 10: event.target.value });
  };

  render() {
    document.title = CONFIG.PAGE_TITLE + 'Vendor Listings';
    const { isLoading, vendorError, vendor, vendorList, vendorLogo, pageCount, states, childCategoryList } = this.state;
    
    return (
      <main className="dashboard-layout-height background-clr-admin">
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div className="vendors-search-list">
          <div className="vendor-listing-dashboard leftandright-nomargin">
            <div className="heading">
              <h5>Ventors Listing</h5>
              {/* <div><span className="heading-broder"></span></div> */}
            </div>
            <div className="vendor-form form-back-shadow">
              <AvForm onSubmit={this.searchSubmit.bind(this)} ref={c => (this.myFormSearch = c)}>
                <Row>
                  <Col md={3}>
                    <AvField name="CompanyName" label="Company Name" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField name="City" label="City" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField type="select" name="State" value={this.state.searchStateId}
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
                  <Col md={3} className="btn-search">
                    <Button color="primary" className="search-butn" >Search</Button>
                    <Button onClick={this.resetSearch.bind(this)} className="btn-reset">Reset</Button>
                    <br/>
                    <span className="sign-error">{vendorError}</span>
                  </Col>
                </Row>
              </AvForm>
            </div>
          </div>
          <Row>
            <Col md={6} className="total-numb">
              {vendorList.Vendors && vendorList.Vendors.length > 0 ? <p>Total Vendor Listings: {vendorList.Pagination.TotalRecords}</p> : ''}
            </Col>
            <Col md={6} className="add-new-btn">
              <Link onClick={this.toggleAddModal.bind(this)} >[+] Add New Vendor</Link>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="overflow-scroll-table br-0 table-model">
                {vendorList.Vendors && vendorList.Vendors.length > 0 ?
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Company Name</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell>State</TableCell>
                        <TableCell>Zip</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vendorList.Vendors ? vendorList.Vendors.map((record) =>
                        <TableRow key={record.VendorID}>
                          <TableCell>{moment(record.CreatedDate).format("L")}</TableCell>
                          <TableCell className="word-brk">{record.CompanyName}</TableCell>
                          <TableCell>{record.City}</TableCell>
                          <TableCell>{record.StateName}</TableCell>
                          <TableCell>{record.ZipCode}</TableCell>
                          <TableCell>
                            <Button className="no-button-background" onClick={() => this.toggleUpdateModal(record)}><img src={editicon} alt="edit" title="Edit" /></Button>
                            {
                              record.ISActive ?
                                <Button className="no-button-background" onClick={() => this.deleteVendor(record.VendorID)}><img src={deleteicon} alt="delete" title="Delete" /></Button> :
                                <Button className="no-button-background" onClick={() => this.restoreVendor(record.VendorID)}><img src={restoreicon} alt="restore" title="Restore" /></Button>
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
                          rowsPerPageOptions={[1]}
                          colSpan={6}
                          count={vendorList.Vendors ? vendorList.Pagination.TotalRecords : 0}
                          rowsPerPage={CONFIG.PAGE_LENGTH}
                          page={pageCount}
                          SelectProps={{
                            native: true,
                          }}
                          onChangePage={this.handleChangePageTrack}
                          onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                          ActionsComponent={VendorWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                  : <h6 className="no-records-found">No records found</h6>}
              </div>
            </Col>
          </Row>
          <Modal size="md" id="tst1" name="tst1" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
            <ModalHeader toggle={this.toggleClose.bind(this)}>{this.state.vendorId === 0 ? 'Add New' : 'Update'} Vendor</ModalHeader>
            <ModalBody className="overflow-scroll basic-details">
              {
                vendor ?
                  <AvForm onSubmit={this.addVendor.bind(this)} ref={c => (this.myFormRef = c)}>
                    <Row>
                      <Col md={6}>
                        <AvField name="CompanyName" label="Company Name:" type="text" value={vendor.CompanyName} validate={{
                          required: { value: true, errorMessage: 'Company Name is required' }
                        }} />
                      </Col>
                      <Col md={6}>
                        <AvField name="Address1" label="Address Line 1:" value={vendor.Address1} />
                      </Col>
                      <Col md={6}>
                        <AvField name="Address2" label="Address Line 2:" value={vendor.Address2} />
                      </Col>
                      <Col md={6}>
                        <AvField name="City" label="City:" value={vendor.City} />
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
                        <AvField name="Country" label="Country:" value={vendor.Country} />
                      </Col>
                      <Col md={6}>
                        <AvField name="ZipCode" label="Zip Code:" value={vendor.ZipCode} />
                      </Col>
                      <Col md={6}>
                        <AvField name="Website" label="Website:" value={vendor.Website} validate={{
                          required: { value: true, errorMessage: 'Website is required' },
                          pattern: {value: '(https?|ftp)://(www\d?|[a-zA-Z0-9]+)?\.[a-zA-Z0-9-]+(\:|\.)([a-zA-Z0-9.]+|(\d+)?)([/?:].*)?', errorMessage: 'Website is not valid'}
                        }} />
                      </Col>
                      <Col md={12}>
                        <AvField type="textarea" name="Description" className="description-box-height" label="Description:" value={vendor.Description} />
                      </Col>
                      <Col md={6}>
                        <label>Logo:</label>
                        {
                          vendorLogo.length > 0 ?
                          <div>
                            <img className="img-size-propertydetails" src={'/VendorLogos/' + vendor.Logo} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} alt={vendor.CompanyName} />
                            <div class="type-container" onClick={() => this.removeVendorLogo(vendor.VendorID)}>
                              <img src={deleteicon} alt="delete" title="Delete" />
                            </div>
                          </div>
                          : 
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
                            //acceptedFileTypes={['image/*']}
                            labelIdle="Drag & Drop your logo OR Browse"
                            //accept="*"
                            maxFiles={1}
                            server={{
                              url: CONFIG.API_URL + 'shop/upload',
                              timeout: 7000,
                              process: this.processHandler
                            }}
                          >
                          </FilePond>
                        }
                        <div className="clear"></div>
                      </Col>
                    </Row>

                    <Row className="save-right">
                      <Col md={12}>
                        <Button id="btn" className="next-btn submit-btn btn-design">Save</Button>
                        <Button className="btn-reset" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                        <br/>
                        <span className="sign-error">{vendorError}</span>
                      </Col>
                    </Row>
                  </AvForm>
                  : ''}
            </ModalBody>
          </Modal>
          <Modal size="md" id="tst2" name="tst2" isOpen={this.state.categoryModal} toggle={this.toggleNestedClose.bind(this)} className=" edit-market-dashboard">
            <ModalHeader toggle={this.toggleNestedClose.bind(this)}>{this.state.vendorId === 0 ? 'Add New' : 'Update'} Vendor</ModalHeader>
            <ModalBody className="overflow-scroll basic-details">
              <div className="table-category">
                {childCategoryList.Categories && childCategoryList.Categories.length > 0 ?
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="table-width-header">Select</TableCell>
                        <TableCell>Category Name</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {childCategoryList.Categories ? childCategoryList.Categories.map((category) =>
                        <TableRow key={category.ID}>
                          <TableCell className="table-width-header">
                            <Checkbox checked={this.state.selectedCategoryIDs != [] && this.state.selectedCategoryIDs.indexOf(category.ID) !== -1} className="track-check"
                              onChange={event => this.onChangeCategory(event, category.ID)} />
                          </TableCell>
                          <TableCell>{category.Name} </TableCell>
                        </TableRow>
                      ) :
                        <TableRow><h6 className="no-records-found">There is no category found</h6></TableRow>
                      }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[1]}
                          colSpan={2}
                          count={childCategoryList.Categories ? childCategoryList.Pagination.TotalRecords : 0}
                          rowsPerPage={CONFIG.PAGE_LENGTH}
                          page={pageCount}
                          SelectProps={{
                            native: true,
                          }}
                          onChangePage={this.handleChildChangePageTrack}
                          onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                          ActionsComponent={VendorWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                  : <h6 className="no-records-found">No records found</h6>}
                <Row className="float-style-right">
                  <Button onClick={this.addVendorCategory.bind(this)} >Submit</Button>
                </Row>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </main>
    );
  }
}
