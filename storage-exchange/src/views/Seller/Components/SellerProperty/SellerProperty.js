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
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { getFormattedInt } from "../../../../Utils/utils";
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
import './SellerProperty.css';

var fileDownload = require('react-file-download');

const actionsStyles = theme => ({
    tablepaggination: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing * 2.5,
    },
});

class Seller extends React.Component {

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

const SellerWrapped = withStyles(actionsStyles, { withTheme: true })(
    Seller,
);






export default class SellerProperty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId: parseInt(this.props.match.params.propertyId),
            sellerData: [],
            pageCount: 0,
            documentData: [],
            buyerData: [],
            storeData: [],
            addModal: false,
            buyerDeal: [],

        };
    }
    dealPopup(buyer) {
        this.setState(state => ({ addModal: !state.addModal, buyerDeal: buyer }))
    }



    acceptDeal(deal) {
        this.setState({ isLoading: true })
        const data = {
            'Id': parseInt(deal.ID),
            'StoreId': parseInt(deal.StoreID),
            'BuyerId': parseInt(deal.BuyerID),
            'Price': deal.Price
        }
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'seller/deal/accept/', data)
            .then(res => {
                alert('Notification has been send to dealer')
                this.toggleClose();
                this.propertyDeals();
                this.setState({ isLoading: false })
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false })
            })

    }


    rejectDeal(deal) {
        this.setState({ isLoading: true })
        const data = {
            'Id': parseInt(deal.ID),
            'StoreId': parseInt(deal.StoreID),
            'BuyerId': parseInt(deal.BuyerID),
            'Price': deal.Price
        }
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'seller/deal/reject/', data)
            .then(res => {
                alert('Notification has been send to dealer')
                this.setState({ isLoading: false })
                this.propertyDeals();

            })
            .catch((err) => {
                this.setState({ isLoading: false })
                console.log(err);

            })

    }
    componentWillReceiveProps(nextprops) {

        let storeId = parseInt(nextprops.match.params.propertyId)
        this.setState({ isLoading: true, storeId: storeId }, () => {
            this.propertyDeals();
        });
    }

    propertyDeals() {
        this.state.isLoading = false;
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'seller/store/buyers/' + this.state.storeId)
            .then(res => {

                this.setState({ buyerData: res.data.buyerStores, documentData: res.data.documents, storeData: res.data.stores, isLoading: false });
            })
            .catch((err) => {
                console.log(err);

            })
    }
    toggleClose = () => this.setState(state => ({ addModal: false }))

    toggleClose() {

        this.propertyDeals();
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.propertyDeals();
    }
    handleChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Properties';
        const { isLoading, propertyData, imageName, sellerData, buyerData, documentData, pageCount, storeData, buyerDeal } = this.state;

        return (
            <main className="dashboard-layout-height">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="seller-dashboard-perperty">
                    <Row className="seller-property-head">
                        <Col md={12}>
                            <div className="heading">
                                <h5>{storeData.StoreName}</h5>
                                {/* <div><span className="heading-broder"></span></div> */}
                            </div>
                            <div className="prpertyaddress">
                                <p>{storeData.Address1}, {storeData.Address2 ? storeData.Address2 + ',' : ''} {storeData.City}, {storeData.ZipCode}</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {buyerData.length > 0 ? buyerData.map(buyer => {
                            return (
                                <Col md={3}>
                                    <div className="border-seller">
                                        <div className="offers-presend">  {/* {property.Status === 'Available' ? 'Available' :property.Status === 'Sold'? 'Sale':property.Status==='Due Diligence' ? 'Contract':''} */}
                                            Offer Presented: ${getFormattedInt(buyer.Price)}
                                        </div>

                                        <div>
                                            <h6>Offer Date: {moment(buyer.CreatedDate).format('L')}</h6>
                                            <p>Name: {buyer.LOIName}</p>
                                            <p>Company Name: {buyer.LOICompanyName}</p>
                                            <p>Source Of Financing: {buyer.SourceOfFinancing}</p>
                                            <p>Diligence Period: {buyer.DiligencePeriod}</p>
                                            <p>Earnest Money Deposit: ${getFormattedInt(buyer.EarnestMoneyDeposit)}</p>
                                        </div>

                                        <div className="btn-center-align">
                                            <h4>{buyer.DealStatus}</h4>
                                            {/* {
                                                buyer.DealStatusID == 4 ?
                                                    <div> <Button className="due-dill-btn" onClick={this.dealPopup.bind(this, buyer)}>Accept</Button>
                                                        <Button className="reject-button" onClick={this.rejectDeal.bind(this, buyer)}>Reject</Button>   </div>
                                                    :
                                                    <div>
                                                        {buyer.DealStatusID == 1 ? <h4 className="due-dill">Due Dilligence Mode</h4> : <h4 className="hold">On Hold</h4>
                                                        }
                                                    </div>
                                            } */}
                                        </div>

                                    </div>
                                </Col>
                            )
                        }) : <Col className="no-document-for-seller">No Deals</Col>}
                    </Row>
                    <br />
                    <Container>
                        <div className="documents-list-seller">
                            <h5>Documents List</h5>
                        </div>
                    </Container>
                    {documentData.length === 0 ? <Row className="no-document-for-seller"><Col>No documents for this property</Col></Row> :
                        <Row className="document-list-seller">
                            <Col md={8}>

                                <div className="table-seller-property">
                                    <Table className="table custom-table table-bordered store-count-popup">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>S.No</TableCell> */}
                                                <TableCell>Document Name</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {documentData ? documentData.slice(pageCount * 10, pageCount * 10 + 10).map((document) =>
                                                <TableRow key={document.DocumentTypeID}>
                                                    {/* <TableCell>{document.DocumentTypeID}</TableCell> */}
                                                    <TableCell>{document.DocumentType}</TableCell>
                                                    <TableCell><a href={'/StoreDocuments/' + document.FileName} download className="link-view">View</a> </TableCell>
                                                </TableRow>
                                            ) :
                                                <TableRow></TableRow>
                                            }
                                        </TableBody>
                                        {/* <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[1]}
                                                colSpan={3}
                                                count={sellerData ? sellerData.length : 0}
                                                rowsPerPage={10}
                                                page={pageCount}
                                                SelectProps={{
                                                    native: true,
                                                }}
                                                onChangePage={this.handleChangePageTrack}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                ActionsComponent={SellerWrapped}
                                            />
                                        </TableRow>
                                    </TableFooter> */}
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    }
                    <div>
                        <Modal size="md" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} className="confirm-btn create-new edit-market-dashboard">
                            <ModalHeader className="header-confirm" toggle={this.toggleClose.bind(this)}>{storeData.StoreName}
                            </ModalHeader>
                            <ModalBody className="overflow-scroll basic-details">
                                <div className="confirm-box">
                                    <p>Please note that you are accepting the offer of ${getFormattedInt(buyerDeal.Price)} </p>
                                    <p>from the buyer and ready to move the property into the due dilligence state</p>
                                </div>
                                <Row className="save-right">
                                    <Col md={12}>
                                        <Button className="offer-confirm-btn" onClick={this.acceptDeal.bind(this, buyerDeal)}>Confirm</Button>
                                        <Button className="offer-cantl-btn" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                                    </Col>
                                </Row>

                            </ModalBody>
                        </Modal>

                    </div>
                </div>
            </main>
        );
    }
}
