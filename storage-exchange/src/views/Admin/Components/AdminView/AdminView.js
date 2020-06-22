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
import './AdminView.css';
import delete_icon from '../../../../Assets/Img/delete.png';
import restore_icon from '../../../../Assets/Img/restore-icon.png';
import editicon from '../../../../Assets/Img/edit.png';
import { parse } from 'react-filepond';

const actionsStyles = theme => ({
  tablepaggination: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing * 2.5,
  },
});

class AdminViewTable extends React.Component {

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

const AdminViewTableWrapped = withStyles(actionsStyles, { withTheme: true })(
  AdminViewTable,
);


export default class AdminView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addModal: false,
      userDetail: [],
      pageCount: 0,
      userList: [],
      userData: [],
      userType: 1,
      stateList: [],
      stateId: 0,
      searchStateId: 0,
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
      ],
      isLoading: false
    }
    //  this.viewAdmin = this.viewAdmin.bind(this);

  }
  stateChange(e) {

    var value = e.target.value;
    this.setState({ stateId: value })
  }

  addtoggleModal() {

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.get(CONFIG.API_URL + 'lookup/state')
      .then(res => {
        let stateList = res.data;
        this.setState(state => ({ addModal: !state.addModal, stateList, userData: [] }))

      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
      })

  }

  toggleClose = () => this.setState(state => ({ addModal: false }))

  createUser(event, errors, values) {
    if (errors.length > 0) {

      console.log(errors);
    }
    else {
      if (values.ID == "") {

        const data = {
          "FirstName": values.FirstName,
          "LastName": values.LastName,
          "Email": values.Email,
          "UserTypeID": this.state.userType,
          "Address1": '',
          "Address2": '',
          "City": '',
          "State": '',
          "ZipCode": '',
          // "StateId": 0,
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
            this.state.userList.Criteria.Page = 1;
            this.getDetails(null);
            this.toggleClose();

          })
          .catch((err) => {
            console.log(err);
            alert(err.response.data);

          })


      }
      else {
        const data = {
          "ID": parseInt(values.ID),
          "FirstName": values.FirstName,
          "LastName": values.LastName,
          "Email": values.Email,
          "UserTypeID": this.state.userData.UserTypeID

        }
        let token = localStorage.getItem('accessKey');
        if (token) {
          axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'admin/user/edit/', data)
          .then(res => {
            this.myFormRef && this.myFormRef.reset();
            this.getDetails(null);
            this.toggleClose();
          })
          .catch((err) => {
            console.log(err);
            alert(err.response.data);
          })
      }
    }
  }

  getDetails(params) {
    this.setState({ isLoading: true })
    if (params == null) {
      params = this.state.userList.Criteria;
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.post(CONFIG.API_URL + 'admin/users', params)
      .then(res => {
        let users = res.data;
        this.setState({ userList: users,isLoading: false });
      })
      .catch((err) => {
       this.setState({ isLoading: false});
        console.log(err);

      })
  }
  deleteAdmin(id, adminId) {
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.post(CONFIG.API_URL + 'admin/user/status/' + id + '/' + adminId)
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
            this.setState({ isLoading: true })
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.delete(CONFIG.API_URL + 'admin/user/' + id)
              .then(res => {
                this.setState({ isLoading: false })
                this.getDetails(null);
              })
              .catch((err) => {
                this.setState({ isLoading: false })
                console.log(err);
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
            this.setState({ isLoading: true })
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.request({
              url: CONFIG.API_URL + 'admin/user/' + id,
              method: 'put',
            })
              .then(res => {
                this.setState({ isLoading: false })
                this.getDetails(null);

              })
              .catch(err => {
                this.setState({ isLoading: false })
                console.log(err);
              });
          }
        },
        {
          label: 'No'
        }
      ]
    });

  }

  viewAdmin(adminId) {
    let userId = adminId;
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.get(CONFIG.API_URL + 'admin/users/' + userId)
      .then(res => {
        let userData = res.data.User;
        // let firstName = userData.FirstName;
        // let lastName = userData.LastName;
        // let phone = userData.PhoneNumber;
        // let statusRejected;
        // let statusApproved;

        // if (userData.IsActive == true) {
        //     statusRejected = false;
        //     statusApproved = true;
        // }
        // else {
        //     statusApproved = true;
        //     statusRejected = false;
        // }

        let userEmail = userData.Email.toLowerCase();
        let sellerData = res.data.SellerStores;
        let stateList = res.data.States;
        this.setState({ userData, addModal: true, stateList })
      })
      .catch((err) => {
        console.log(err);

      })
  }

  search(event, errors, values) {
    // let userData = this.state.userData;
    // if (values.Status == "0") {
    //   userData = userData.filter(i => i.IsConfirmed === false && i.IsActive === true)
    //   console.log(userData);
    // }
    // else if (values.Status == "1") {
    //   userData = userData.filter(i => i.IsConfirmed === true && i.IsActive === true)
    // }
    // else if (values.Status == "2") {
    //   userData = userData.filter(i => i.IsConfirmed === false && i.IsActive === false)
    // }
    // this.setState({ userData: userData });
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
    document.title = CONFIG.PAGE_TITLE + 'User Management - Admin Search';
    const { pageCount, userList, statusList, stateList, userData } = this.state;
    return (
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
            {userList.Users && userList.Users.length > 0 ? <p>Total Admins: {userList.Pagination.TotalRecords}</p> : ''}
          </Col>
          <Col md={6} className="add-new-btn">
            <Link onClick={this.addtoggleModal.bind(this)}>[+] Add New Admin</Link>
          </Col>
        </Row>

        <div className="table-model">
          {userList.Users && userList.Users.length > 0 ?
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.Users ? userList.Users.map((admin) =>
                  <TableRow key={admin.ID}>
                    <TableCell>{moment(admin.CreatedDate).format("L")}</TableCell>
                    <TableCell>{admin.FirstName} {admin.LastName}</TableCell>
                    <TableCell>{admin.Email}</TableCell>
                    <TableCell>
                      <Button type="view" className="no-button-background" onClick={this.viewAdmin.bind(this, admin.ID)}><img src={editicon} title="Edit" alt="edit" /></Button>
                      {/* {admin.IsActive == true ?
                        <Button type="delete" className="no-button-background" onClick={this.deleteUser.bind(this, admin.ID)}><img src={delete_icon} alt="delete" title="Delete" /></Button> :
                        <Button type="restore" className="no-button-background" onClick={this.restoreUser.bind(this, admin.ID)}><img src={restore_icon} alt="restore" title="Restore" /></Button>
                      } */}

                      {admin.StatusID == 2 ?
                        <Button type="delete" className="no-button-background" onClick={this.deleteUser.bind(this, admin.ID)}><img src={delete_icon} alt="delete" title="Delete" /></Button> : admin.StatusID == 3 ?
                          <Button type="restore" className="no-button-background" onClick={this.restoreUser.bind(this, admin.ID)}><img src={restore_icon} alt="restore" title="Restore" /></Button> : ''
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
                    ActionsComponent={AdminViewTableWrapped}
                  />
                </TableRow>
              </TableFooter>
            </Table>
            : <h6 className="no-records-found">No records found</h6>}
        </div>
        <div>
          <Modal size="md" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
            <ModalHeader toggle={this.toggleClose.bind(this)}>{userData && userData.ID > 0 ? 'Update Admin' : 'Create Admin'}
            </ModalHeader>
            <ModalBody className="overflow-scroll basic-details">
              <AvForm onSubmit={this.createUser.bind(this)} ref={c => (this.myFormRef = c)}>
                <Row>
                  <Col md={6} className="hidden-field-admin">
                    <AvField type="hidden" name="ID" value={userData ? userData.ID : 0} />
                    <AvField name="FirstName" label="First Name" type="text" value={userData.FirstName ? userData.FirstName : ''} validate={{
                      required: { value: true, errorMessage: 'First Name is required' }
                    }} />

                  </Col>
                  <Col md={6}>

                    <AvField name="LastName" label="Last Name" value={userData.LastName ? userData.LastName : ''} />

                  </Col>
                  <Col md={6}>

                    <AvField name="Email" label="User Email" type="email" value={userData.Username ? userData.Username : ''} validate={{
                      required: { value: true, errorMessage: 'Email is required' }
                    }} />
                  </Col>
                </Row>

                <Row className="save-right">
                  <Col md={12}>
                    <Button id="btn" className="next-btn submit-btn btn-design">Save</Button>
                    <Button className="btn-reset" onClick={this.toggleClose.bind(this)}>cancel</Button>
                  </Col>
                </Row>
              </AvForm>
            </ModalBody>
          </Modal>
        </div>

      </div>
    );
  }
}
