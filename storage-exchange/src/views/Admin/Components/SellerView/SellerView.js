import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../../../Utils/config';
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import { Label, Input } from 'reactstrap';
import moment from 'moment';
import { ReplyMessage } from '../../../Shared/ReplyMessage';
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
import arrow_r from '../../../../Assets/Img/arrow-right.png';
import edit_r from '../../../../Assets/Img/edit-buy.png';
import viewicon from '../../../../Assets/Img/view.png';
import deleteicon from '../../../../Assets/Img/delete.png';
import replyicon from '../../../../Assets/Img/reply.png';
import msg from '../../../../Assets/Img/mail-details.png';
import './SellerView.css';

const actionsStyles = theme => ({
    tablepaggination: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing * 2.5,
    },
});

class SellerViewTable extends React.Component {

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

const SellerViewTableWrapped = withStyles(actionsStyles, { withTheme: true })(
    SellerViewTable,
);


export default class SellerView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sellerId: parseInt(this.props.match.params.sellerId),
            storeId: 0,
            isLoading: false,
            firstName: '',
            lastName: '',
            userEmail: '',
            phone: '',
            statusReject: false,
            statusApprove: false,
            statusApprovalPending: false,
            propertyData: [],
            userType: 3,
            pageCount: 0,
            //checkedData: [],
            viewMessageData: [],
            stateList: [],
            composeMessage: '',
            userData: [],
            userStores: [],
            userMessages: [],
            composeError: false,
            addMessageModal: false,
            updateModal: false,
            storeData: [],
            states: [],
            propertyTypes: [],
            documentTypes: [],
            viewPropertyModal: false,
            stateId: 0,
            storeTypeId: 0,
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
            selectedStoreIDs: [],
            userMessages: [],
            replyMes: false,
            message: [],
            mesRe: []
        }
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.addNewProperty = this.addNewProperty.bind(this);
    }

    getUserDetails() {
        let userId = this.state.sellerId;
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
                let statusReject = userData.IsActive === false ? true : false;
                let statusApprove = userData.IsActive === true ? true : false;
                let statusApprovalPending = userData.IsActive === null ? true : false;

                let userEmail = userData.Email.toLowerCase();
                let stateList = res.data.States;
                this.setState({
                    userData, firstName, lastName, userEmail, stateList, phone, statusReject, statusApprove, statusApprovalPending, stateId: stateId
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getUserStores(params) {
        if (params == null) {
            params = this.state.userStores.Criteria;
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/user/stores', params)
            .then(res => {
                let userStores = res.data;
                this.setState({ userStores, selectedStoreIDs: userStores.SellerStores && userStores.SellerStores.StoreIDs ? userStores.SellerStores.StoreIDs.split(',').map(Number) : [] });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    stateChange(e) {

        var value = e.target.value;
        this.setState({ stateId: value })
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

    readMessage(data) {
        let mesRe = data;
        this.setState({ mesRe: mesRe, replyMes: true, userMessages: this.state.userMessages });
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
                'ToUserID': this.state.sellerId
            }
            axios.post(CONFIG.API_URL + 'home/sendmail/', data)
                .then(res => {
                    this.setState({ isLoading: false, composeError: false })
                    alert('Mail has been sent.')
                    this.toggleClose();
                    this.initializeUserMessageParams();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }


    searchStateChange(e) {
        const { propertyCriteria } = this.state;
        propertyCriteria.StateID = e.target.value;
        this.setState({ propertyCriteria })
    }

    stateChange(e) {
        var value = e.target.value;
        this.setState({ stateId: value })
    }

    storeTypeChange(e) {
        var value = e.target.value;
        this.setState({ storeTypeId: value })
    }

    readMessage(data) {
        let message = data;
        this.setState({ message: message, replyMes: true });
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

    componentDidMount() {
        this.initialLookup();
        this.getUserDetails();
        this.initializeUserStoreParams();
        this.initializeUserMessageParams();
    }

    initializeUserStoreParams() {
        const params = {
            'SellerID': this.state.sellerId,
            'PageLength': CONFIG.PAGE_LENGTH,
            'Page': 1
        }

        this.getUserStores(params);
    }

    initializeUserMessageParams() {
        const params = {
            'FromUserID': this.state.sellerId,
            'PageLength': CONFIG.PAGE_LENGTH,
            'Page': 1
        }

        this.getUserMessages(params);
    }

    onChangeStatus(e, id) {
        if (id == 1) {
            this.approveUser(e);
        }
        else {
            this.rejectUser(e);
        }
    }

    rejectUser(e) {
        confirmAlert({
            title: 'Reject User',
            message: 'Are you sure want to reject this user?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let token = localStorage.getItem('accessKey');
                        if (token) {
                            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
                        }
                        axios.delete(CONFIG.API_URL + 'admin/user/' + this.state.buyerId)
                            .then(res => {
                                this.setState({ statusReject: true, statusApprove: false, statusApprovalPending: false });
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

    addNewProperty() {
        const { from } = { from: { pathname: '/admin/properties' } };
        this.props.history.push(from);
    }

    approveUser(e) {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.request({
            url: CONFIG.API_URL + 'admin/user/' + this.state.buyerId,
            method: 'put',
        })
            .then(res => {
                this.setState({ statusReject: false, statusApprove: true, statusApprovalPending: false });
            })
            .catch(err => {
                console.log(err);
            });
    }

    viewSeller(storeId) {

        //let storeId = storeId;
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'admin/store/' + storeId)
            .then(response => {

                let storeData = response.data.Store;
                let states = this.state.stateList;
                let propertyTypes = this.state.propertyTypes;
                let documentTypes = this.state.documentTypes;
                this.setState({
                    storeData: storeData, viewPropertyModal: !this.state.viewPropertyModal, states: states, propertyTypes: propertyTypes, documentTypes: documentTypes, storeId: storeId
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

    onChangeProperty(e, storeID) {
        // let checkedData = this.state.checkedData;
        // checkedData.push(storeID);
        // this.setState({ checkedData });

        if (e.target.checked) {
            this.state.selectedStoreIDs.push(storeID);
        }
        else {
            this.state.selectedStoreIDs.splice(this.state.selectedStoreIDs.indexOf(storeID), 1);
        }

        let propertyData = this.state.propertyData;
        this.setState({ propertyData });
    }

    addSellerProperty() {
        const data = {
            "SellerId": this.state.sellerId,
            "StoreIDs": this.state.selectedStoreIDs
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'admin/seller/store/', data)
            .then(res => {
                this.getUserStores(null);
                this.toggleClose();
            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data);
            })
    }
    viewMessage(messageId) {

    }

    addtoggleSellerPropertyModal() {
        this.state.propertyCriteria.StateID = this.state.userData.StateID;
        this.state.propertyCriteria.SellerID = this.state.sellerId;
        this.getSellerProperties();
        this.setState(state => ({ addPropertyModal: !state.addPropertyModal }));
    }

    getSellerProperties() {
        let data = {
            StoreName: this.state.propertyCriteria.StoreName,
            City: this.state.propertyCriteria.City,
            StatusID: this.state.propertyCriteria.StatusID,
            StateID: this.state.propertyCriteria.StateID,
            SellerID: this.state.propertyCriteria.SellerID,
            Page: this.state.propertyPagination.page,
            PageLength: this.state.propertyPagination.PageLength
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/stores', data)
            .then(res => {
                let result = res.data;
                this.setState({ propertyData: result.Stores, propertyCriteria: result.Criteria, propertyPagination: result.Pagination })
            })
            .catch((err) => {
                console.log(err);

            });
    }

    addtoggleCommunicationModal() {
        this.setState(state => ({ addMessageModal: !state.addMessageModal }))
        // this.setState(state => ({ addModal: !state.addModal }))
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
            this.getSellerProperties();
        });
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
                this.getSellerProperties();
            });
        }
    }

    handleChangeMessage(e) {
        let composeMessage = e.target.value;
        this.setState({
            composeMessage, composeError: false
        })
    }
    selectProperty(property) {

        let selectedProperty = property;
        console.log(selectedProperty);
        this.setState({ selectedProperty, addPropertyModal: false });

    }
    viewProperty(storeId) {
        const { from } = { from: { pathname: '/admin/property/' + storeId } };
        this.props.history.push(from);
    }
    updateProperty(event, errors, values) {

        this.myFormRef.markAsTouched();
        if (errors.length === 0) {
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
                'RentableSQFT': values.RentableSQFT,
                'Acerage': values.Acerage,
                'Price': values.Price,
                'IsRoomForExpansion': values.IsRoomForExpansion == '1' ? true : false,
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
                        viewPropertyModal: false
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
                this.setState(state => ({ updateModal: !state.updateModal, stateList, userData }))


            })
            .catch((err) => {
                console.log(err);
                alert(err.response.data);
            })

    }
    toggleClose = () => this.setState(state => ({ addPropertyModal: false, addMessageModal: false, updateModal: false, viewPropertyModal: false, viewMessageModal: false }))

    viewMessage(message) {
        let viewMessageData = message;
        this.setState(state => ({ viewMessageData: viewMessageData, viewMessageModal: !state.viewMessageModal }))

    }

    togglePropertyClose() {
        this.setState(state => ({ addPropertyModal: false }))
    }

    handleSellerChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.userStores.Criteria.Page = pageCount + 1;
        this.getUserStores(null);
    };

    handleCommunicationChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.compseData.Criteria.Page = pageCount + 1;
        this.getUserMessages(null);
    };

    handlePropertyChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.propertyPagination.page = pageCount + 1;
        this.getSellerProperties();
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };

    render() {
        document.title = CONFIG.PAGE_TITLE + 'User Management - Seller View';
        const { userStores, userMessages, composeMessage, isLoading, pageCount, firstName, message, mesRe, stateList, lastName, userEmail, phone, propertyData, userData, statusReject, statusApprove, statusApprovalPending, storeData: storeData, states, propertyTypes, propertyCriteria, propertyPagination, stateId, storeTypeId, replyMes, viewMessageData, composeError } = this.state;

        return (
            <main className="dashboard-layout-height">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="seller-view-admin background-clr-admin">
                    <Row className="seller-view-head">
                        <Col md={8}>
                            <div className="heading">
                                <h5>Seller <span>Details</span></h5>
                                <div><span className="heading-broder"></span></div>
                            </div>
                        </Col>
                        <Col md={4} className="heading-right-seller">
                            <h6><img src={arrow_r} className="seller-img" alt="back" title="back to dashboard" /><Link to="/admin/dashboard/2" > Back to Dashboard</Link></h6>
                        </Col>
                    </Row>
                    <div className="buyer-view-details">
                        <Row className="form-back-shadow">
                            <Col sm={12}>
                                <h4>Seller Details</h4>
                            </Col>
                            <Col md={4} className="">
                                <h5><span>Full Name</span></h5>
                                <h5 className="heading-buyer"><Label>{firstName} {lastName}</Label></h5>
                                <h5><span>Phone Number</span></h5>
                                <h5><Label>{phone}</Label></h5>
                                <h5><span>Email Address</span></h5>
                                <h5><Label>{userEmail}</Label></h5>
                                <div className="click-icon-edit">
                                    <Link onClick={this.editUser.bind(this)}><img src={edit_r} className=" img-icon-buy " alt="edit" /> Edit Seller Details</Link>
                                </div>
                            </Col>
                            {/* <Col md={8} className="buyer-status-radio">
                                <Label><b>Seller Status</b></Label>
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
                            </Col> */}
                        </Row>
                    </div>


                    {/*<div className="seller-view-details">
                        <Row>
                            <Container className="container-border-left-seller">
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
                    <div className="leftandright-nomargin">
                        <div className="form-back-shadow">
                            <div className="table-space-buyer">
                                <Row>
                                    <Col md={8}>
                                        <h4 className="property-information-head">Property Information</h4>
                                    </Col>
                                    <Col md={4} className="add-new-btn">
                                        <Link onClick={this.addtoggleSellerPropertyModal.bind(this)} >[+] Add Property</Link>
                                    </Col>
                                </Row>

                                <Col md={12} className="table-model table-seller-padding">
                                    {userStores.Stores && userStores.Stores.length > 0 ?
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Date</TableCell>
                                                    <TableCell>Property Name</TableCell>
                                                    <TableCell>City</TableCell>
                                                    <TableCell>State</TableCell>
                                                    <TableCell>ZipCode</TableCell>
                                                    <TableCell>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {userStores.Stores ? userStores.Stores.map((seller) =>
                                                    <TableRow key={seller.ID}>
                                                        <TableCell>{moment(seller).format("L")}</TableCell>
                                                        <TableCell>{seller.StoreName} </TableCell>
                                                        <TableCell>{seller.City}</TableCell>
                                                        <TableCell>{seller.StateName}</TableCell>
                                                        <TableCell>{seller.ZipCode}</TableCell>
                                                        <TableCell>
                                                            <Link onClick={this.viewProperty.bind(this, seller.StoreID)}><img src={viewicon} alt="view" title="view" /></Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ) :
                                                    <TableRow>No deal</TableRow>
                                                }
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[1]}
                                                        colSpan={7}
                                                        count={userStores.Stores ? userStores.Pagination.TotalRecords : 0}
                                                        rowsPerPage={CONFIG.PAGE_LENGTH}
                                                        page={pageCount}
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                        onChangePage={this.handleSellerChangePageTrack}
                                                        onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                        ActionsComponent={SellerViewTableWrapped}
                                                    />
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                        : <h6 className="no-records-found no-found">No records found</h6>}
                                </Col>
                            </div>

                            <div className="table-seller-padding">
                                <Row>
                                    <Col md={8}>
                                        <h4>Communication</h4>
                                    </Col>
                                    <Col md={4} className="add-new-btn">
                                        <Link onClick={this.addtoggleCommunicationModal.bind(this)} > <img src={msg} className="msg-icon" alt="message" title="Message" /> Compose Message</Link>
                                    </Col>
                                </Row>

                                <Col md={12} className="table-model table-seller-padding">
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
                                                    <TableRow>No Composing message</TableRow>
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
                                                        ActionsComponent={SellerViewTableWrapped}
                                                    />
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                        : <h6 className="no-records-found no-found">No records found</h6>}
                                </Col>

                            </div>
                        </div>
                    </div>
                    <div>{replyMes === true ? <ReplyMessage params={mesRe} allmessage={userMessages}></ReplyMessage> : ''}</div>

                    <div>
                        <Modal size="md" isOpen={this.state.addPropertyModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>Add Properties
                        </ModalHeader>
                            <ModalBody>
                                <p>Search for the property to link to the seller or add a new property by clicking the <span className="create-link" onClick={this.addNewProperty.bind(this)}>link</span>.</p>

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

                                <Col md={12} className="table-scroll table-space-padding scroll-bar-seller">
                                    {propertyData.length > 0 ?
                                        <React.Fragment>Total Properties:
                                            {propertyPagination ? propertyPagination.TotalRecords : 0}
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="table-width-col">Select</TableCell>
                                                        <TableCell>Property Name</TableCell>
                                                        <TableCell>City</TableCell>
                                                        <TableCell>State</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {propertyData ? propertyData.map((property) =>
                                                        <TableRow key={property.StoreID}>
                                                            <TableCell className="table-width-col">
                                                                <Checkbox key={property.StoreID} name="selectCheck" className="track-check"
                                                                    checked={this.state.selectedStoreIDs != [] && this.state.selectedStoreIDs.indexOf(property.StoreID) !== -1}
                                                                    onClick={event => this.onChangeProperty(event, property.StoreID)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{property.StoreName} </TableCell>
                                                            <TableCell>{property.City}</TableCell>
                                                            <TableCell>{property.StateName}</TableCell>
                                                        </TableRow>
                                                    ) :
                                                        <TableRow></TableRow>
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
                                                            ActionsComponent={SellerViewTableWrapped}
                                                        />
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </React.Fragment>
                                        : <h6 className="no-records-found no-found">No records found</h6>}
                                </Col>
                                <Row className="save-right margin-top-buyer">
                                    <Col md={12}>
                                        {propertyData.length > 0 ? <Button onClick={this.addSellerProperty.bind(this)} >Submit</Button> : ''}
                                        <Button onClick={this.toggleClose.bind(this)} className="btn-reset" id="btnCancel">Cancel</Button>
                                    </Col>
                                </Row>

                            </ModalBody>
                        </Modal>
                    </div>
                    <div>
                        {/* <Modal size="md" isOpen={this.state.addPropertyModal} toggle={this.toggleClose.bind(this)} className="edit-market-dashboard">
                        <ModalHeader toggle={this.togglePropertyClose.bind(this)}>Select Property
                        </ModalHeader>
                        <ModalBody>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Property Name</TableCell>
                                        <TableCell>City</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {propertyData ? propertyData.slice(pageCount * 10, pageCount * 10 + 10).map((property) =>
                                        <TableRow key={property.StoreID}>
                                            <TableCell>{property.StoreName}</TableCell>
                                            <TableCell>{property.City} </TableCell>

                                            <TableCell>

                                                <Link onClick={this.selectProperty.bind(this, property)}>Select</Link>
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
                                            colSpan={5}
                                            count={dealData ? dealData.length : 0}
                                            rowsPerPage={10}
                                            page={pageCount}
                                            SelectProps={{
                                                native: true,
                                            }}
                                            onChangePage={this.handleChangePageTrack}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                            ActionsComponent={SellerViewTableWrapped}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>

                        </ModalBody>
                    </Modal> */}
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
                                        {composeError == true ? <p>Please enter description</p> : ''}
                                    </Col>

                                </Row>

                                <Row className="save-right margin-top-buyer">
                                    <Col md={12}>
                                        <Button onClick={this.sendMessage.bind(this)}>Send Message</Button>
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
                                                <td> {moment(viewMessageData.CreatedDate).format("L")}</td>
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
                            <ModalHeader toggle={this.toggleClose.bind(this)}>Update Seller</ModalHeader>
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
                                            <Button className="btn-reset" oncli={this.toggleClose.bind(this)}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </AvForm>
                            </ModalBody>
                        </Modal>
                    </div>
                    <div>
                        <Modal size="md" id="mdForm" name="mdForm" isOpen={this.state.viewPropertyModal} toggle={this.toggleClose.bind(this)} className="edit-market-dashboard">
                            <ModalHeader toggle={this.toggleClose.bind(this)}>
                                Update Property
                            </ModalHeader>
                            <ModalBody className="overflow-scroll basic-details">
                                <AvForm model={storeData} onSubmit={this.updateProperty.bind(this)} ref={c => (this.myFormRef = c)}>
                                    <Row>
                                        <Col md={6}>
                                            <AvField name="StoreName" label="Property Name:" type="text" validate={{
                                                required: { value: true, errorMessage: 'Property Name is required' },
                                                maxLength: { value: 200 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="Price" label="Property Value:" type="text" validate={{
                                                required: { value: true, errorMessage: 'Property Value is required' },
                                                pattern: { value: '^[0-9](\.[0-9]+)?$' },
                                                maxLength: { value: 9 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="Address1" label="Address Line 1:" validate={{
                                                required: { value: true, errorMessage: 'Property Value is required' },
                                                maxLength: { value: 300 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="Address2" label="Address Line 2:" value={storeData.Address2} validate={{
                                                maxLength: { value: 100 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="City" label="City:" value={storeData.City} validate={{
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
                                            <AvField name="Country" label="Country:" value={storeData.Country} validate={{
                                                maxLength: { value: 20 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvField name="ZipCode" label="Zip Code:" value={storeData.ZipCode} validate={{
                                                maxLength: { value: 20 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvField type="select" name="PropertyTypeId" value={this.state.storeTypeId}
                                                onChange={(e) => this.storeTypeChange(e)}
                                                label="Property Type:" >
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
                                            <AvField name="RentableSQFT" label="Rentable Sqare Feet:" validate={{
                                                pattern: { value: '^[0-9](\.[0-9]+)?$' },
                                                maxLength: { value: 9 }
                                            }} />
                                        </Col>
                                        <Col md={12}>
                                            <AvField name="Acerage" label="Acerage:" validate={{
                                                pattern: { value: '^[0-9](\.[0-9]+)?$' },
                                                maxLength: { value: 9 }
                                            }} />
                                        </Col>
                                        <Col md={6}>
                                            <AvRadioGroup inline name="IsRoomForExpansion" label="Room For Expansion:" required>
                                                <AvRadio label="Yes" value="true" />
                                                <AvRadio label="No" value="false" />
                                            </AvRadioGroup>
                                        </Col>
                                        <Col md={6}>
                                            <AvField type="checkbox" name="IsFeatureListing" label="Featured Listing:" value={storeData.IsFeatureListing} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12} className="save-right">
                                            <Button id="btn" className="next-btn submit-btn btn-design">Save</Button>
                                            <Button className="btn-reset" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                                        </Col>
                                    </Row>
                                </AvForm>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
            </main>
        );
    }
}
