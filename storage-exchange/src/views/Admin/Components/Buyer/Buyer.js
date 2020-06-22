import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../../../Utils/config';
import { Link, Route, withRouter } from "react-router-dom";
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
import './Buyer.css';
import delete_icon from '../../../../Assets/Img/delete.png';
import restore_icon from '../../../../Assets/Img/restore-icon.png';
import view_icon from '../../../../Assets/Img/view.png';
import pending_icon from '../../../../Assets/Img/pending.png';

const validateProperties = (value, ctx) => {
    if (isNaN(ctx.NumberOfProperties)) {
        return "No Of Properties should be a number";
    } else if (ctx.RentableSQFT <= 0 && ctx.RentableSQFT != "") {
        return "No Of Properties should be greater than zero";
    }
    return true;
}

const actionsStyles = theme => ({
    tablepaggination: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing * 2.5,
    },
});

class BuyerTable extends React.Component {

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

const BuyerTableWrapped = withStyles(actionsStyles, { withTheme: true })(
    BuyerTable,
);


export default class Buyer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addModal: false,
            userDetail: [],
            pageCount: 0,
            userList: [],
            userType: 2,
            stateList: [],
            stateId: 0,
            positionList: [],
            position: 0,
            statusList: [
                {
                    "id": -1,
                    "name": "All"
                },
                {
                    "id": 1,
                    "name": "Pending"
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
        this.viewBuyer = this.viewBuyer.bind(this);

    }



    addtoggleModal() {

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'lookup/state')
            .then(res => {
                let stateList = res.data;
                this.setState(state => ({ addModal: !state.addModal, stateList }))

            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data);
            })
        axios.get(CONFIG.API_URL + 'lookup/user/position')
            .then(res => {
                let positionList = res.data;
                this.setState({ positionList })

            })
            .catch((err) => {
                console.log(err);
            })

    }
    stateChange(e) {

        var value = e.target.value;
        this.setState({ stateId: value })
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    createUser(event, errors, values) {

        if (errors.length > 0) {

            console.log(errors);
        }
        else {
            this.setState({ isLoading: true })
            const { position } = this.state;
            const data = {
                "FirstName": values.FirstName,
                "LastName": values.LastName,
                "Email": values.Email,
                "UserTypeID": this.state.userType,
                "Address1": values.AddressLine1,
                "Address2": values.AddressLine2,
                "City": values.City,
                "PhoneNumber": values.Phone,
                "State": values.State,
                "Zipcode": values.ZipCode,
                "StateId": parseInt(this.state.stateId),
                //"IsConfirmed": 1,
                "IsActive": 1,
                "StatusID": 2,
                'CapitalSource': values.CapitalSource,
                'NumberOfProperties': values.NumberOfProperties,
                'CompanyName': values.CompanyName,
                'PositionID': position,
            }
            let token = localStorage.getItem('accessKey');
            if (token) {
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.post(CONFIG.API_URL + 'account/register/', data)
                .then(res => {
                    this.myFormRef && this.myFormRef.reset();
                    this.state.userList.Criteria.Page = 1;
                    this.setState({ isLoading: false })
                    alert('Buyer has been created and notification has been sent.')
                    this.getDetails(null);
                    this.toggleClose();
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ isLoading: false })
                    alert(err.response.data);
                })
        }

    }


    approveUser(id) {
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
                alert('Notification has been send to user.')
                this.getDetails(null);
                // this.setState({ statusReject: false, statusApprove: true, statusApprovalPending: false, isLoading: false });
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteBuyer(id, buyerId) {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'admin/user/status/' + id + '/' + buyerId)
            .then(res => {
                this.getDetails(null);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    toggleClose = () => this.setState(state => ({ addModal: false, stateId: 0 }))

    getDetails(params) {
        if (params == null) {
            params = this.state.userList.Criteria;
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        this.setState({ isLoading: true });

        axios.post(CONFIG.API_URL + 'admin/users', params)
            .then(res => {

                let users = res.data;
                this.setState({ userList: users, isLoading: false });
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
                                this.setState({ isLoading: false });
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
            title: 'Restore User',
            message: 'Are you sure want to restore this user?',
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

    viewBuyer(buyerId) {
        const { from } = { from: { pathname: '/viewbuyer/' + buyerId } };
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
        document.title = CONFIG.PAGE_TITLE + 'User Management - Buyer Search';
        const { isLoading, pageCount, userList, statusList, stateList, positionList, position } = this.state;

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
                            {userList.Users && userList.Users.length > 0 ? <p>Total Buyers: {userList.Pagination.TotalRecords}</p> : ''}
                        </Col>
                        <Col md={6} className="add-new-btn">
                            <Link onClick={this.addtoggleModal.bind(this)}>[+] Add New Buyer</Link>
                        </Col>
                    </Row>
                    <div className="table-model">
                        {userList.Users && userList.Users.length > 0 ?
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Buyer</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {userList.Users ? userList.Users.map((buyer) =>
                                        <TableRow key={buyer.ID}>
                                            <TableCell>{moment(buyer.CreatedDate).format("L")}</TableCell>
                                            <TableCell>{buyer.FirstName} {buyer.LastName}</TableCell>
                                            <TableCell>{buyer.PhoneNumber}</TableCell>
                                            <TableCell>{buyer.Email}</TableCell>
                                            <TableCell>
                                                <Button type="view" className="no-button-background" onClick={this.viewBuyer.bind(this, buyer.ID)}><img src={view_icon} alt="view" title="View" /></Button>
                                                {/* {(buyer.IsConfirmed == true && buyer.IsActive ==true) ? <span>
                                                    {buyer.IsActive == true ?
                                                        <Button type="delete" onClick={this.deleteUser.bind(this, buyer.ID)}><img src={delete_icon} alt="delete" title="Delete" /></Button> :
                                                        <Button type="restore" onClick={this.restoreUser.bind(this, buyer.ID)}><img src={restore_icon} alt="restore" title="Restore" /></Button>
                                                    }</span> : ''
                                                } */}
                                                {/* {buyer.IsConfirmed == true ? <span>
                                                    {buyer.IsActive == true ?
                                                        <Button type="delete" className="padding-button" onClick={this.deleteUser.bind(this, buyer.ID)}><img src={delete_icon} alt="delete" title="Delete" /></Button> :
                                                        <Button type="restore" className="padding-button" onClick={this.restoreUser.bind(this, buyer.ID)}><img src={restore_icon} alt="restore" title="Restore" /></Button>
                                                    }</span> : ''
                                                } */}

                                                {buyer.StatusID == 2 ?
                                                    <Button type="delete" className="no-button-background" onClick={this.deleteUser.bind(this, buyer.ID)}><img src={delete_icon} alt="delete" title="Delete" /></Button> : buyer.StatusID == 3 ?
                                                        <Button type="restore" className="no-button-background" onClick={this.restoreUser.bind(this, buyer.ID)}><img src={restore_icon} alt="restore" title="Restore" /></Button> : buyer.StatusID == 1 ?
                                                            <Button type="restore" className="no-button-background" onClick={this.restoreUser.bind(this, buyer.ID)}><img src={pending_icon} alt="restore" title="Approve Pending" /></Button> : ''
                                                }

                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        <TableRow>No data found</TableRow>
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
                                            ActionsComponent={BuyerTableWrapped}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            : <h6 className="no-records-found">No records found</h6>}
                    </div>
                    <div>
                        <Modal size="md" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>Create Buyer</ModalHeader>
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
                                                label="State"
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
                                        <Col md={6}>
                                            <AvField name="CompanyName" label="Company Name" placeholder="" type="text" maxLength="1000" validate={{
                                                required: { value: true, errorMessage: 'Company Name is required' }
                                            }} />
                                        </Col><Col md={6}>
                                            <AvField type="select" name="position" value={position}
                                                onChange={(e) => this.handleChange(e)}
                                                label="Position"
                                                validate={{
                                                    required: { value: true, errorMessage: 'Position is required' },
                                                }}>
                                                <option value="0">--Select--</option>
                                                {positionList ? positionList.map(n => {
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
                                            <AvField name="NumberOfProperties" label="No Of Properties" placeholder="" type="text" maxLength="255"
                                                validate={{ myValidation: validateProperties }}
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="CapitalSource" label="Capital Source" placeholder="" type="text" maxLength="2000" validate={{
                                                required: { value: true, errorMessage: 'Capital Source is required' }
                                            }} />
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
            </main >
        );
    }
}
