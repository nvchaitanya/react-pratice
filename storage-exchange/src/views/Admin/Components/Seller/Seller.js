import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../../../Utils/config';
import { Link } from "react-router-dom";
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
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './Seller.css';
import delete_icon from '../../../../Assets/Img/delete.png';
import restore_icon from '../../../../Assets/Img/restore-icon.png';
import view_icon from '../../../../Assets/Img/view.png';
import transitions from '@material-ui/core/styles/transitions';

const actionsStyles = theme => ({
  tablepaggination: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing * 2.5,
  },
});

class SellerTable extends React.Component {

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

const SellerTableWrapped = withStyles(actionsStyles, { withTheme: true })(
  SellerTable,
);

export default class Seller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      userDetail: [],
      pageCount: 0,
      userList: [],
      userType: 3,
      stateList: [],
      stateId: 0,
      statusList: [
        {
          "id": -1,
          "name": "All"
        },
        {
          "id": 2,
          "name": "Approved"
        },
        {
          "id": 3,
          "name": "Rejected"
        }
      ]
    }
    this.viewSeller = this.viewSeller.bind(this);
  }
  addtoggleModal() {

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.get(CONFIG.API_URL + 'lookup/state')
      .then(res => {
        let stateList = res.data;
        this.setState(state => ({ addModal: !state.addModal, stateList, stateId: 0 }))

      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
      })
  }
  toggleClose = () => this.setState(state => ({ addModal: false }))


  stateChange(e) {

    var value = e.target.value;
    this.setState({ stateId: value })
  }

  createUser(event, errors, values) {

    if (errors.length > 0) {

      console.log(errors);
    }
    else {
      this.setState({ isLoading: true });
      const { stateId, userType } = this.state;

      const data = {
        "FirstName": values.FirstName,
        "LastName": values.LastName,
        "Email": values.Email,
        "UserTypeID": userType,
        "PhoneNumber": values.Phone,
        "Address1": values.AddressLine1,
        "Address2": values.AddressLine2,
        "City": values.City,
        "State": values.State,
        "ZipCode": values.ZipCode,
        "StateId": parseInt(this.state.stateId),
        "IsConfirmed": 1,
        "IsActive": 1,
        "StatusID": 2
      }
      let token = localStorage.getItem('accessKey');
      if (token) {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
      }
      axios.post(CONFIG.API_URL + 'account/register/', data)
        .then(res => {

          this.myFormRef && this.myFormRef.reset();
          const { userList } = this.state;
          userList.Criteria.Page = 1;
          this.setState({ userList, isLoading: false }, () => {
            this.toggleClose();
            this.getDetails(null);

          });
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          console.log(err);
          alert(err.response.data);

        })
    }
  }

  getDetails(params) {
    if (params == null) {
      params = this.state.userList.Criteria;
    }
    let token = localStorage.getItem('accessKey');
    this.setState({ isLoading: true });

    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }

    axios.post(CONFIG.API_URL + 'admin/users', params)
      .then(res => {
        let users = res.data;
        this.setState({ userList: users, isLoading: false });
      })
      .catch((err) => {
        this.setState({ isLoading: false });
      })
  }

  deleteSeller(id, sellerId) {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.post(CONFIG.API_URL + 'admin/user/status/' + id + '/' + sellerId)
      .then(res => {
        this.getDetails(null);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  deleteUser(id) {
    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            this.setState({ isLoading: true });
            axios.delete(CONFIG.API_URL + 'admin/user/' + id)
              .then(res => {
                this.getDetails(null);
                this.setState({ isLoading: false });
              })
              .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false });
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  }

  restoreUser(id) {

    confirmAlert({
      title: 'Delete User',
      message: 'Are you sure want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            this.setState({ isLoading: true });
            axios.request({
              url: CONFIG.API_URL + 'admin/user/' + id,
              method: 'put',
            })
              .then(res => {
                this.getDetails(null);
                this.setState({ isLoading: false });
              })
              .catch(err => {
                console.log(err);
                this.setState({ isLoading: false });
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });
  }

  viewSeller(sellerId) {
    const { from } = { from: { pathname: '/viewseller/' + sellerId } };
    this.props.params.history.push(from);
  }

  search(event, errors, values) {
    const params = {
      'Name': values.Name,
      'Status': values.Status,
      'UserType': this.state.userType,
      'PageLength': CONFIG.PAGE_LENGTH,
      'Page': 1
    }

    this.getDetails(params);
  }

  componentDidMount() {
    const params = {
      'Name': '',
      'Status': -1,
      'UserType': this.state.userType,
      'PageLength': CONFIG.PAGE_LENGTH,
      'Page': 1
    }

    this.getDetails(params);
  }

  resetSearch() {
    this.myFormSearch && this.myFormSearch.reset();
    const params = {
      'Name': '',
      'Status': -1,
      'UserType': this.state.userType,
      'PageLength': CONFIG.PAGE_LENGTH,
      'Page': 1
    }

    this.getDetails(params);
  }

  handleChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.userList.Criteria.Page = pageCount + 1;
    this.getDetails(null);
  };

  handleChangeRowsPerPageTrack = event => {
    this.setState({ pageCount: 0, 10: event.target.value });
  };

  render() {
    document.title = CONFIG.PAGE_TITLE + 'User Management - Seller Search';
    const { isLoading, pageCount, userList, statusList, stateList } = this.state;
    return (
      <main className="dashboard-layout-height">
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div className="admin-dash-details">
          <AvForm onSubmit={this.search.bind(this)} ref={c => (this.myFormSearch = c)} className="form-back-shadow">
            <Row>
              <Col md={4}>
                <AvField name="Name" label="Name" />
              </Col>
              <Col md={4}>
                <AvField type="select" name="Status" label="Status" helpMessage="" value="-1">
                  {statusList ? statusList.map((c) =>
                    <option value={c.id}>{c.name}</option>
                  ) : ''}
                </AvField>
              </Col>
              <Col md={4} className="btn-search">
                <Button id="btn" color="primary" className="search-butn">Search</Button>
                <Button onClick={this.resetSearch.bind(this)} className="btn-reset">Reset</Button>
              </Col>
            </Row>
          </AvForm>
          <Row className="padding-col">
            <Col md={6} className="total-numb">
              {userList.Users && userList.Users.length > 0 ? <p>Total Sellers: {userList.Pagination.TotalRecords}</p> : ''}
            </Col>
            <Col md={6} className="add-new-btn">
              <Link onClick={this.addtoggleModal.bind(this)}>[+] Add New Seller</Link>
            </Col>
          </Row>

          <div className="table-model">
            {userList.Users && userList.Users.length > 0 ?
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Seller</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userList.Users ? userList.Users.map((seller) =>
                    <TableRow key={seller.ID}>
                      <TableCell>{moment(seller.CreatedDate).format("L")}</TableCell>
                      <TableCell>{seller.FirstName} {seller.LastName}</TableCell>
                      <TableCell>{seller.PhoneNumber}</TableCell>
                      <TableCell>{seller.Email}</TableCell>
                      <TableCell>
                        <Button type="view" className="no-button-background" onClick={this.viewSeller.bind(this, seller.ID)}><img src={view_icon} alt="view" title="View" /></Button>
                        {seller.StatusID == 2 ?
                          <Button type="delete" className="no-button-background" onClick={this.deleteUser.bind(this, seller.ID)}><img src={delete_icon} alt="delete" title="Delete" /></Button> : seller.StatusID == 3 ?
                            <Button type="restore" className="no-button-background" onClick={this.restoreUser.bind(this, seller.ID)}><img src={restore_icon} alt="restore" title="Restore" /></Button> : ''
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
                      colSpan={5}
                      count={userList.Users ? userList.Pagination.TotalRecords : 0}
                      rowsPerPage={CONFIG.PAGE_LENGTH}
                      page={pageCount}
                      SelectProps={{
                        native: true,
                      }}
                      onChangePage={this.handleChangePageTrack}
                      onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                      ActionsComponent={SellerTableWrapped}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
              : <h6 className="no-records-found">No records found</h6>}
          </div>
          <div>
            <Modal size="md" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
              <ModalHeader toggle={this.toggleClose.bind(this)}>Create Seller
                        </ModalHeader>
              <ModalBody className="overflow-scroll basic-details">
                <AvForm onSubmit={this.createUser.bind(this)} ref={c => (this.myFormRef = c)}>
                  <Row>
                    <Col md={6}>
                      <AvField name="FirstName" label="First Name" type="text" validate={{
                        required: { value: true, errorMessage: 'First Name is required' }
                      }} />
                    </Col>
                    <Col md={6}>
                      <AvField name="LastName" label="Last Name" />
                    </Col>
                    <Col md={6}>
                      <AvField name="Email" label="User Email" type="email" validate={{
                        required: { value: true, errorMessage: 'Email is required' }
                      }} />
                    </Col>
                    <Col md={6}>
                      <AvField name="Phone" label="Phone Number" placeholder="000-000-0000" type="text"
                        validate={{
                          required: { value: true, errorMessage: 'Phone Number is required' },
                          pattern: { value: /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, errorMessage: 'Phone Number is invalid' }
                        }} />
                    </Col>
                    <Col md={6}>
                      <AvField name="AddressLine1" label="Address Line 1" />
                    </Col>
                    <Col md={6}>
                      <AvField name="AddressLine2" label="Address Line 2" />
                    </Col>
                    <Col md={6}>
                      <AvField name="City" label="City" />
                    </Col>
                    <Col md={6}>
                      <AvField type="select" name="State" value={this.state.stateId}
                        onChange={(e) => this.stateChange(e)}
                        label="State:"
                        validate={{
                          required: { value: true, errorMessage: 'State is required' },
                        }}>
                        <option value="0">--Select--</option>
                        {stateList ? stateList.map(n => {
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
                      <AvField name="ZipCode" label="Zip Code" />
                    </Col>
                  </Row>
                  <Row className="save-right">
                    <Col md={12}>
                      <Button id="btn" className="next-btn submit-btn btn-design">Save</Button>
                      <Button className="btn-reset" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                    </Col>
                  </Row>
                </AvForm>
              </ModalBody>
            </Modal>
          </div>

        </div>
      </main>
    );
  }
}
