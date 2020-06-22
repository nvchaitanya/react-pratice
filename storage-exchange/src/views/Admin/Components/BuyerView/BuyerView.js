import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../../../Utils/config';
import { Link } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import { Label, Input } from 'reactstrap';
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
import { ReplyMessage } from '../../../Shared/ReplyMessage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import arrow_r from '../../../../Assets/Img/arrow-right.png';
import edit_r from '../../../../Assets/Img/edit-buy.png';
import viewicon from '../../../../Assets/Img/view.png';
import editicon from '../../../../Assets/Img/edit.png';
import deleteicon from '../../../../Assets/Img/delete.png';
import replyicon from '../../../../Assets/Img/reply.png';
import msg from '../../../../Assets/Img/mail-details.png';
import './BuyerView.css';

const actionsStyles = theme => ({
    tablepaggination: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing * 2.5,
    },
});

class BuyerViewTable extends React.Component {

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

const BuyerViewTableWrapped = withStyles(actionsStyles, { withTheme: true })(
    BuyerViewTable,
);

export default class BuyerView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            buyerId: parseInt(this.props.match.params.buyerId),
            firstName: '',
            lastName: '',
            userEmail: '',
            phone: '',
            updateModal: false,
            pageCount: 0,
            propertyData: [],
            viewData: [],
            dealLookup: [],
            addDealModal: false,
            addPropertyModal: false,
            statusApprove: false,
            statusReject: false,
            statusApprovalPending: false,
            selectedProperty: [],
            propertyDescription: '',
            userType: 2,
            composeMessage: '',
            addMessageModal: false,
            viewMessageData: [],
            stateId: 0,
            userData: [],
            stateList: [],
            userDeals: [],
            userMessages: [],
            replyMes: false,
            message: [],
            composeError: false,
            mesRe: [],
            errorSelect: false,
            propertyCriteria: {
                StoreName: '',
                City: '',
                StatusID: 0,
                StateID: 0,
                SellerID: 0
            },
            propertyPagination: {
                Page: 1,
                PageLength: CONFIG.PAGE_LENGTH,
                TotalRecords: 0,
                TotalPages: 0
            },


        }

        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    }

    statusLookup() {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'lookup/store/status')
            .then(res => {

                let dealLookup = res.data;
                this.setState({ dealLookup })
            })
            .catch((err) => {
                console.log(err);

            })
    }
    stateChange(e) {

        var value = e.target.value;
        this.setState({ stateId: value })
    }

    viewDeal(deal) {

        let viewData = deal;
        let propertyDescription = deal.Description;
        let selectedProperty = {
            "StoreID": deal.StoreID,
            "StoreName": deal.StoreName
        }
        this.setState(state => ({ addDealModal: !state.addDealModal, selectedProperty: selectedProperty, viewData: viewData, propertyDescription: propertyDescription }))
    }
    handleChangeDescription(e) {
        let propertyDescription = e.target.value;
        this.setState({
            propertyDescription, composeError: false
        })
    }
    searchStateChange(e) {
        const { propertyCriteria } = this.state;
        propertyCriteria.StateID = e.target.value;
        this.setState({ propertyCriteria })
    }

    search(event, errors, values) {
        if (errors.length === 0) {
            const { propertyCriteria } = this.state;
            propertyCriteria.StoreName = values.StoreName;
            propertyCriteria.City = values.City;

            this.setState(state => ({
                propertyCriteria,
                propertyPagination: {
                    Page: 1,
                    PageLength: CONFIG.PAGE_LENGTH,
                }
            }), () => {
                this.getProperties();
            });
        }
    }


    getUserDetails() {
        let userId = this.state.buyerId;
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'admin/users/' + userId)
            .then(res => {
                let userData = res.data.User;
                let firstName = userData.FirstName;
                let lastName = userData.LastName;
                let phone = userData.PhoneNumber;
                let stateId = res.data.User.StateId;
                let statusReject = userData.StatusID === 3 ? true : false;
                let statusApprove = userData.StatusID === 2 ? true : false;
                let statusApprovalPending = userData.StatusID === 1 ? true : false;
                let userEmail = userData.Email.toLowerCase();

                this.setState({ userData, firstName, lastName, userEmail, phone, statusReject, statusApprove, statusApprovalPending, stateId: stateId })
            })
            .catch((err) => {
                console.log('error occured in getuserdetails',err);
            })
    }

    getUserDeals(params) {
        if (params == null) {
            params = this.state.userDeals.Criteria;
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/user/deals', params)
            .then(res => {
                let userDeals = res.data;
                this.setState({ userDeals });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getUserMessages(params) {
        if (params == null) {
            params = this.state.userMessages.Criteria;
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/user/messages', params)
            .then(res => {
                let userMessages = res.data;
                this.setState({ userMessages });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    componentDidMount() {
        this.statusLookup();
        this.getUserDetails();
        this.lookupState();
        this.initializeUserDealParams();
        this.initializeUserMessageParams();

    }

    initializeUserDealParams() {
        const params = {
            'BuyerID': this.state.buyerId,
            'PageLength': CONFIG.PAGE_LENGTH,
            'Page': 1
        }

        this.getUserDeals(params);
    }

    initializeUserMessageParams() {
        const params = {
            'FromUserID': this.state.buyerId,
            'PageLength': CONFIG.PAGE_LENGTH,
            'Page': 1
        }

        this.getUserMessages(params);
    }
    lookupState() {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'lookup/state')
            .then(res => {
                let stateList = res.data;


                this.setState(state => ({ stateList: stateList }))

            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data);
            })
    }

    onChangeStatus(e, id) {
        if (id == 1) {
            this.approveUser(e);
        }
        else {
            this.rejectUser(e);
        }
    }

    editUser(e) {

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'lookup/state')
            .then(res => {
                let stateList = res.data;

                // let stateId = this.state.userData.StateId;
                let userData = this.state.userData;
                this.setState(state => ({ updateModal: !state.updateModal, stateList: stateList, userData }))

            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data);
            })

    }

    rejectUser(e) {
        confirmAlert({
            title: 'Reject User',
            message: 'Are you sure want to reject this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        this.setState({ isLoading: true })
                        let token = localStorage.getItem('accessKey');
                        if (token) {
                            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
                        }
                        axios.delete(CONFIG.API_URL + 'admin/user/' + this.state.buyerId)
                            .then(res => {
                                this.setState({ statusRejected: true, statusApproved: false, isLoading: false });
                                this.getUserDetails();
                            })
                            .catch((err) => {
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

    approveUser(e) {
        this.setState({ isLoading: true })
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.request({
            url: CONFIG.API_URL + 'admin/user/' + this.state.buyerId,
            method: 'put',
        })
            .then(res => {
                alert('Status has been approved.')
                this.getUserDetails();
                this.setState({ statusReject: false, statusApprove: true, statusApprovalPending: false, isLoading: false });
            })
            .catch(err => {
                console.log(err);
            });
    }

    addtoggleDealModal() {
        this.setState(state => ({ addDealModal: !state.addDealModal, selectedProperty: [], viewData: [], propertyDescription: '' }))
    }
    handleChangeMessage(e) {
        let composeMessage = e.target.value;
        this.setState({
            composeMessage, composeError: false
        })
    }

    getProperties() {

        let data = {
            StoreName: this.state.propertyCriteria.StoreName,
            City: this.state.propertyCriteria.City,
            StatusID: this.state.propertyCriteria.StatusID,
            StateID: this.state.propertyCriteria.StateID,
            SellerID: this.state.propertyCriteria.SellerID,
            Page: this.state.propertyPagination.Page,
            PageLength: this.state.propertyPagination.PageLength
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/stores', data)
            .then(res => {
                let result = res.data;
                let stateList = this.state.stateList;
                let propertyData = res.data.Stores
                this.setState({ propertyData: propertyData, propertyCriteria: result.Criteria, propertyPagination: result.Pagination, stateList: stateList })

            })
            .catch((err) => {
                console.log(err);

            });
    }

    addtogglePropertyModal() {
        this.getProperties()
        this.setState(state => ({ addPropertyModal: !state.addPropertyModal }))


    }
    addtoggleCommunicationModal() {

        this.setState(state => ({ addMessageModal: !state.addMessageModal }))

    }
    viewtoggleCommunicationModal() {

        this.setState(state => ({ viewMessageModal: !state.viewMessageModal }))

    }


    createDeal(event, errors, values) {
        debugger;
        if (errors.length > 0) {
            console.log(errors);
        }
        else {
            if (this.state.selectedProperty.length == 0) {
                this.setState({ errorSelect: true })
            }
            else {

                if (values.ID == "") {
                    values.ID = 0;
                }
                const data = {
                    "ID": values.ID,
                    "BuyerID": this.state.buyerId,
                    "StoreID": this.state.selectedProperty.StoreID,
                    "DealName": values.DealName,
                    "Description": this.state.propertyDescription,
                    "Price": parseInt(values.Price),
                    "IsInterested": true,
                    "DealStatusID": 4
                }
                let token = localStorage.getItem('accessKey');
                if (token) {
                    axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
                }
                axios.post(CONFIG.API_URL + 'admin/deal/', data)
                    .then(res => {

                        //this.myFormRef && this.myFormRef.reset();
                        this.getUserDetails();
                        this.getUserDeals();
                        this.toggleClose();

                    })
                    .catch((err) => {
                        console.log(err);
                        alert(err.response.data);
                    })
            }

        }

    }
    resetSearch() {
        this.myFormSearch && this.myFormSearch.reset();

        this.setState(state => ({
            propertyCriteria: {
                StoreName: '',
                City: '',
            },
            propertyPagination: {
                Page: 1,
                PageLength: CONFIG.PAGE_LENGTH,
            }
        }), () => {
            this.getProperties();
        });
    }


    readMessage(data) {
        let mesRe = data;
        this.setState({ mesRe: mesRe, replyMes: true, userMessages: this.state.userMessages });
    }


    updateUser(event, errors, values) {
        if (errors.length > 0) {

            console.log(errors);
        }
        else {

            const data = {
                "ID": this.state.userData.ID,
                "FirstName": values.FirstName,
                "LastName": values.LastName,
                "Email": values.Email,
                "UserTypeID": this.state.userData.UserTypeID,
                "Address1": values.AddressLine1,
                "Address2": values.AddressLine2,
                "City": values.City,
                "State": values.State,
                "Zipcode": values.ZipCode,
                "PhoneNumber": values.Phone,
                "State": values.State,
                "StateId": parseInt(this.state.stateId)
            }
            let token = localStorage.getItem('accessKey');
            if (token) {
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            axios.post(CONFIG.API_URL + 'admin/user/edit/', data)
                .then(res => {
                    this.myFormRef && this.myFormRef.reset();
                    this.getUserDetails();
                    this.toggleClose();
                })
                .catch((err) => {
                    console.log(err);
                    alert(err.response.data);
                })
        }
    }

    deleteMessage(message) {

        confirmAlert({
            title: 'Delete Message',
            message: 'Are you sure want to delete this message?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let token = localStorage.getItem('accessKey');
                        if (token) {
                            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
                        }
                        axios.delete(CONFIG.API_URL + 'admin/delete/message/' + message.ID)
                            .then(res => {
                                this.initializeUserMessageParams();
                            })
                            .catch((err) => {
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

    selectProperty(property) {

        let selectedProperty = property;
        // console.log(selectedProperty);
        console.log(selectedProperty);
        this.setState({ selectedProperty, addPropertyModal: false, errorSelect: false });

    }


    sendMessage() {
        if (this.state.composeMessage == '') {
            this.setState({ composeError: true })
        }
        else {
            this.setState({ isLoading: true })
            let token = localStorage.getItem('accessKey');
            if (token) {
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            const data = {
                'MailContent': this.state.composeMessage,
                'ToUserID': this.state.buyerId
            }
            axios.post(CONFIG.API_URL + 'home/sendmail/', data)
                .then(res => {
                    this.setState({ isLoading: false, composeError: false })
                    alert('Mail has been sent.');
                    this.toggleClose();
                    this.initializeUserMessageParams()

                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    toggleClose = () => this.setState(state => ({ addDealModal: false, addPropertyModal: false, addMessageModal: false, updateModal: false, viewMessageModal: false }))

    togglePropertyClose() {

        this.setState(state => ({ addPropertyModal: false }))
    }

    handleChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
    };

    handleDealChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.userDeals.Criteria.Page = pageCount + 1;
        this.getUserDeals(null);
    };

    handleCommunicationChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.compseData.Criteria.Page = pageCount + 1;
        this.getUserMessages(null);
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };


    handlePropertyChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.propertyPagination.Page = pageCount + 1;
        this.getProperties();
    };

    viewMessage(message) {

        let viewMessageData = message;
        this.setState(state => ({ viewMessageData: viewMessageData, viewMessageModal: !state.viewMessageModal }))

    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'User Management - Buyer View';
        const { userDeals, viewData, userMessages, composeMessage, pageCount, composeError, isLoading, stateList, message, firstName, mesRe, lastName, userEmail, phone, propertyData, statusReject, statusApprove, statusApprovalPending, selectedProperty, propertyDescription, userData, replyMes, viewMessageData, stateId, propertyCriteria, propertyPagination, errorSelect } = this.state;

        return (
            <main className="dashboard-layout-height">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="buyer-view-admin background-clr-admin">
                    <Row className="buyer-view-head">
                        <Col md={8}>
                            <div className="heading">
                                <h5>Buyer <span>Details</span></h5>
                                <div><span className="heading-broder"></span></div>
                            </div>
                        </Col>
                        <Col md={4} className="heading-right-buyer">
                            <h6><img src={arrow_r} className="buyer-img" alt="back" title="back to dashboard" /><Link to="/admin/dashboard/1" > Back to Dashboard</Link></h6>
                        </Col>
                    </Row>
                    <div className="buyer-view-details">
                        <Row className="form-back-shadow">
                            <Col sm={12}>
                                <h4>Buyer Details</h4>
                            </Col>
                            <Col md={4} className="">
                                <h5><span>Full Name</span></h5>
                                <h5 className="heading-buyer"><Label>{firstName} {lastName}</Label></h5>
                                <h5><span>Phone Number</span></h5>
                                <h5><Label>{phone}</Label></h5>
                                <h5><span>Email Address</span></h5>
                                <h5><Label>{userEmail}</Label></h5>
                                <div className="click-icon-edit">
                                    <Link onClick={this.editUser.bind(this)}><img src={edit_r} className=" img-icon-buy " alt="edit" title="Edit" /> Edit Buyer Details</Link>
                                </div>
                            </Col>
                            <Col md={8} className="buyer-status-radio">
                                <Label><b>Buyer Status</b></Label>
                                <br />
                                <label className="form-check-label">
                                    <Radio name="status" value="1" checked={statusApprove} onChange={event => this.onChangeStatus(event, 1)} />
                                    Approve
                                    </label>

                                <label className="form-check-label">
                                    <Radio name="status" value="0" checked={statusReject} onChange={event => this.onChangeStatus(event, 0)} />
                                    Reject
                                </label>

                                <label className="form-check-label">
                                    <Radio name="status" value="" checked={statusApprovalPending} disabled="true" />
                                    Approval Pending
                               </label>
                            </Col>
                        </Row>
                    </div>

                    {/*<div className="buyer-view-details">
                        <Row>
                            <Container className="container-border-left">
                            <h6><img src={edit_r} className=" img-icon-buy " alt="edit" /><Link onClick={this.editUser.bind(this)}> Edit</Link></h6>
                                <h5 className="heading-buyer"><Label>{firstName} {lastName}</Label></h5>
                                <h5><Label>{phone}</Label></h5>
                                <h5><Label>{userEmail}</Label></h5>
                                <Label>Status</Label>
                                <label className="form-check-label">
                                    <Radio name="status" value="1" checked={statusApprove} onChange={event => this.onChangeStatus(event, 1)} />
                                    Approve
                                    </label>

                                <label className="form-check-label">
                                    <Radio name="status" value="0" checked={statusReject} onChange={event => this.onChangeStatus(event, 0)} />
                                    Reject
                                </label>

                                <label className="form-check-label">
                                    <Radio name="status" value="" checked={statusApprovalPending} disabled="true" />
                                    Approval Pending
                               </label>
                            </Container>
                        </Row>
                    </div>*/}

                    <div className="leftandright-nomargin" >
                        <div className="form-back-shadow">
                            <div className="table-space-buyer">
                                <Row>
                                    <Col md={8}>
                                        <h4>Deal Information</h4>
                                    </Col>
                                    <Col md={4} className="add-new-btn">
                                        <Link onClick={this.addtoggleDealModal.bind(this)} >[+] Add Deal</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="table-buyer-view">
                                        {userDeals.Deals && userDeals.Deals.length > 0 ?
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>Property Name</TableCell>
                                                        <TableCell>City</TableCell>
                                                        <TableCell>State</TableCell>
                                                        <TableCell>ZipCode</TableCell>
                                                        <TableCell>Deal Stage</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {userDeals.Deals ? userDeals.Deals.map((deal) =>
                                                        <TableRow key={deal.ID}>
                                                            <TableCell>{moment(deal).format("L")}</TableCell>
                                                            <TableCell>{deal.StoreName} </TableCell>
                                                            <TableCell>{deal.City}</TableCell>
                                                            <TableCell>{deal.State}</TableCell>
                                                            <TableCell>{deal.ZipCode}</TableCell>
                                                            <TableCell>{deal.DealStatus}</TableCell>
                                                            <TableCell>
                                                                <Link onClick={this.viewDeal.bind(this, deal)}><img src={editicon} alt="Edit" title="Edit" /></Link>
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
                                                            colSpan={7}
                                                            count={userDeals.Deals ? userDeals.Pagination.TotalRecords : 0}
                                                            rowsPerPage={CONFIG.PAGE_LENGTH}
                                                            page={pageCount}
                                                            SelectProps={{
                                                                native: true,
                                                            }}
                                                            onChangePage={this.handleDealChangePageTrack}
                                                            onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                            ActionsComponent={BuyerViewTableWrapped}
                                                        />
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                            : <h6 className="no-records-found no-found">No records found</h6>}
                                    </Col>
                                </Row>
                            </div>
                            <div className="table-space-buyer">
                                <Row>
                                    <Col md={8}>
                                        <h4>Communication</h4>
                                    </Col>
                                    <Col md={4} className="add-new-btn">
                                        <Link onClick={this.addtoggleCommunicationModal.bind(this)} ><img src={msg} className="msg-icon" alt="message" title="Message" /> Compose Message</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12} className="table-buyer-view">
                                        {userMessages.Messages && userMessages.Messages.length > 0 ?
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Date</TableCell>
                                                        <TableCell>From</TableCell>
                                                        <TableCell>For Property</TableCell>
                                                        <TableCell>Subject</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {userMessages.Messages ? userMessages.Messages.map((message) =>
                                                        <TableRow >
                                                            <TableCell>{moment(message.CreatedDate).format("L")}</TableCell>
                                                            <TableCell>{message.FromUserName}</TableCell>
                                                            <TableCell>{message.StoreName}</TableCell>
                                                            <TableCell>{message.MailSubject}</TableCell>
                                                            <TableCell className="link-space">
                                                                <Link onClick={this.viewMessage.bind(this, message)}><img src={viewicon} alt="view" /></Link>
                                                                <Link onClick={this.readMessage.bind(this, message)}><img src={replyicon} alt="reply" title="Reply" /></Link>
                                                                <Link onClick={this.deleteMessage.bind(this, message)}><img src={deleteicon} alt="delete" title="Delete" /></Link>
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
                                                            count={userMessages.Messages ? userMessages.Pagination.TotalRecords : 0}
                                                            rowsPerPage={CONFIG.PAGE_LENGTH}
                                                            page={pageCount}
                                                            SelectProps={{
                                                                native: true,
                                                            }}
                                                            onChangePage={this.handleCommunicationChangePageTrack}
                                                            onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                            ActionsComponent={BuyerViewTableWrapped}
                                                        />
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                            : <h6 className="no-records-found no-found">No records found</h6>}


                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div>{replyMes === true ? <ReplyMessage params={mesRe} allmessage={userMessages}></ReplyMessage> : ''}</div>

                    <div>
                        <Modal size="md" isOpen={this.state.addDealModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>Add New Deal
                        </ModalHeader>
                            <ModalBody>
                                <AvForm onSubmit={this.createDeal.bind(this)} ref={c => (this.myFormRef = c)}>
                                    <Row>
                                        <Col md={6} className="hidden-field-buyer">
                                            <AvField type="hidden" name="ID" value={viewData ? viewData.ID : 0} />
                                            <AvField name="DealName" label="Deal Name" type="text" value={viewData.DealName ? viewData.DealName : ''}
                                                validate={{
                                                    required: { value: true, errorMessage: 'Deal Name is required.' }
                                                }} />

                                        </Col>
                                        <Col md={6}>
                                            <AvField name="Price" label="Price" type="number" value={viewData.Price ? viewData.Price : ''}
                                                validate={{
                                                    required: { value: true, errorMessage: 'Price is required.' }
                                                }} />

                                        </Col>
                                        <Col md={4}>
                                            <h5>Property:</h5>
                                        </Col>
                                        <Col md={8}>
                                            {/* <Label>Select Property</Label> */}
                                            <Button onClick={this.addtogglePropertyModal.bind(this)} className="select-category-buyer " >Select Property</Button>{errorSelect == true ? <p>Please select the property</p> : ''}
                                            <Label className="label-break-buyer">{selectedProperty.StoreName ? selectedProperty.StoreName : ''}</Label>
                                        </Col>
                                        <Col md={12}>
                                            <Label>Description</Label>
                                            <Input type="textarea" className="description-box-height" name="Description" value={propertyDescription ? propertyDescription : ''} onChange={this.handleChangeDescription.bind(this)} />
                                        </Col>
                                    </Row>
                                    <Row className="save-right margin-top-buyer">
                                        <Col md={12}>
                                            <Button id="btn" className="next-btn submit-btn btn-design">Submit</Button>
                                            <Button className="btn-reset" id="btnCancel" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </AvForm>
                            </ModalBody>
                        </Modal>
                    </div>
                    <div>
                        <Modal size="md" isOpen={this.state.addPropertyModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.togglePropertyClose.bind(this)}>Select Property
                        </ModalHeader>
                            <ModalBody>

                                <AvForm onSubmit={this.search.bind(this)} ref={c => (this.myFormSearch = c)}>
                                    <Row>
                                        <Col md={12}>
                                            <AvField name="StoreName" label="Property Name" />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="City" label="City" />
                                        </Col>
                                        <Col md={6}>
                                            <AvField type="select" name="State" label="State" helpMessage="" value={propertyCriteria.StateID}
                                                onChange={(e) => this.searchStateChange(e)}>
                                                <option value=''>--Select State--</option>
                                                {stateList ? stateList.map((c) =>
                                                    <option key={c.ID} value={c.ID}>{c.Name}</option>
                                                ) : ''}
                                            </AvField>
                                        </Col>
                                        <Col md={12} className="save-right  margin-top-seller">
                                            <Button id="btn" className="">Search</Button>
                                            <Button className="btn-reset" id="btnCancel" onClick={this.resetSearch.bind(this)}>Reset</Button>
                                        </Col>
                                    </Row>
                                </AvForm>
                                <div className="table-scroll">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Property Name</TableCell>
                                                <TableCell>City</TableCell>
                                                {/* <TableCell>State</TableCell>
                                    <TableCell>State</TableCell>
                                    <TableCell>ZipCode</TableCell>
                                    <TableCell>Deal Stage</TableCell> */}
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {propertyData ? propertyData.map((property) =>
                                                <TableRow key={property.StoreID}>
                                                    <TableCell>{property.StoreName}</TableCell>
                                                    <TableCell>{property.City} </TableCell>
                                                    <TableCell>

                                                        <Link className="view-btn-select" onClick={this.selectProperty.bind(this, property)}>Select</Link>
                                                    </TableCell>
                                                </TableRow>
                                            ) :
                                                <TableRow>No property</TableRow>
                                            }
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[1]}
                                                    colSpan={4}
                                                    count={propertyPagination ? propertyPagination.TotalRecords : 0}
                                                    rowsPerPage={CONFIG.PAGE_LENGTH}
                                                    page={pageCount}
                                                    SelectProps={{
                                                        native: true,
                                                    }}
                                                    onChangePage={this.handlePropertyChangePageTrack}
                                                    onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                    ActionsComponent={BuyerViewTableWrapped}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                    <div>
                        <Modal size="md" isOpen={this.state.addMessageModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>Compose Message
                        </ModalHeader>
                            <ModalBody className="overflow-scroll basic-details">
                                <Row>
                                    <Col md={12}>
                                        <Label>Description</Label>
                                        <Input type="textarea" className="description-box-height" name="Message" value={composeMessage} onChange={this.handleChangeMessage.bind(this)} />
                                        {composeError == true ? <p className="error">Please enter description</p> : ''}
                                    </Col>

                                </Row>

                                <Row className="save-right margin-top-buyer">
                                    <Col md={12}>
                                        <Button className="" onClick={this.sendMessage.bind(this)}>Send Message</Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </Modal>

                    </div>

                    <div>
                        <Modal size="md" isOpen={this.state.viewMessageModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>View Message
                        </ModalHeader>
                            <ModalBody className="overflow-scroll basic-details">
                                <Row>
                                    <Col md={12} className="table-no-border">
                                        <table>
                                            <tr>
                                                <td><b>Date:</b></td>
                                                <td>{moment(viewMessageData.CreatedDate).format("L")}</td>
                                            </tr>
                                            <tr>
                                                <td><b>From:</b></td>
                                                <td>{viewMessageData.FromUserName}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Subject:</b></td>
                                                <td>{viewMessageData.MailSubject}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Content:</b></td>
                                                <td><div className="box-content-msg">{viewMessageData.MailContent}</div></td>
                                            </tr>
                                        </table>
                                    </Col>
                                </Row>

                                {/* <Row>
                                    <Col md={12}>
                                        <Label>Description</Label>
                                        <Input type="textarea" name="Message" value={composeMessage} onChange={this.handleChangeMessage.bind(this)} />
                                    </Col>

                                </Row>

                                <Row className="save-right margin-top-buyer">
                                    <Col md={12}>
                                        <Button>Send Message</Button>
                                    </Col>
                                </Row> */}
                                <p></p>
                            </ModalBody>
                        </Modal>

                    </div>

                    <div>
                        <Modal size="md" isOpen={this.state.updateModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>Update Buyer</ModalHeader>
                            <ModalBody className="overflow-scroll basic-details">
                                <AvForm onSubmit={this.updateUser.bind(this)} ref={c => (this.myFormRef = c)}>
                                    <Row>
                                        <Col md={6}>

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
                                        <Col md={6}>
                                            <AvField name="Phone" label="Phone Number" placeholder="000-000-0000" type="text" value={userData.PhoneNumber ? userData.PhoneNumber : ''}
                                                validate={{
                                                    required: { value: true, errorMessage: 'Phone Number is required' },
                                                    pattern: { value: /^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/, errorMessage: 'Phone Number is invalid' }
                                                }} />
                                        </Col>
                                        <Col md={6}>

                                            <AvField name="AddressLine1" label="Address Line 1" value={userData.Address1 ? userData.Address1 : ''} />

                                        </Col>
                                        <Col md={6}>

                                            <AvField name="AddressLine2" label="Address Line 2" value={userData.Address2 ? userData.Address2 : ''} />

                                        </Col>
                                        <Col md={6}>
                                            <AvField name="City" label="City" value={userData.City ? userData.City : ''} />
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

                                            <AvField name="ZipCode" label="Zip Code" value={userData.ZipCode ? userData.ZipCode : ''} />

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
