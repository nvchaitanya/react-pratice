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
import grid_icon from '../../../../Assets/Img/grid.png';
import list_icon from '../../../../Assets/Img/list.png';
import arrow_r from '../../../../Assets/Img/arrow-right.png';
import edit_r from '../../../../Assets/Img/edit-buy.png';
import viewicon from '../../../../Assets/Img/view.png';
import address_icon from '../../../../Assets/Img/location-details.png';
import imgg from '../../../../Assets/Img/feature-img.png';
import feature_home from '../../../../Assets/Img/noimglist.png';
import no_img from '../../../../Assets/Img/ventor-list.png';
import './SellerDashboard.css';


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


export default class SellerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

            sellerData: [],
            pageCount: 0,
            viewType: 1
        };
    }
    viewType(type) {

        this.setState({ viewType: type })
    }
    getSellerProperties() {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'seller/stores')
            .then(res => {
                let sellerData = res.data.Stores;
                this.setState({ sellerData: sellerData, isLoading: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false })
            })
    }
    sellerProperty(property) {
        this.setState({ isLoading: true })
        const { from } = { from: { pathname: "/seller/property/" + property.StoreID + "/" + property.StoreName } };
        this.props.history.push(from)
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        this.getSellerProperties();
    }
    handleChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Dashboard';
        const { isLoading, propertyData, imageName, sellerData, pageCount, viewType } = this.state;

        return (
            <main className="dashboard-layout-height">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="seller-dashboard-admin">
                    {sellerData.length > 0 ? <Row className="seller-dash-head">
                        <Col md={10}>
                            <div className="heading">
                                <h5>Properties Listed</h5>
                                {/* <div><span className="heading-broder"></span></div> */}
                            </div>
                        </Col>
                        <Col md={2} >
                            <div className="right-side-dashboard">
                                <h6>View By: </h6>
                                <div className="btn-list">
                                    <Button onClick={this.viewType.bind(this, 1)}><img src={list_icon} alt="" title="List View" /></Button>
                                </div>
                                <div className="btn-grid">
                                    <Button onClick={this.viewType.bind(this, 2)}><img src={grid_icon} alt="" title="Grid View" /></Button>
                                </div>
                            </div>
                        </Col>
                    </Row> : ''}
                    {sellerData.length > 0 ?

                        <div>


                            {viewType === 1 ?

                                <div className="table-seller-dashboard">
                                    <div className="seller-container">
                                        <Table className="table custom-table  store-count-popup">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Date Listed</TableCell>
                                                    <TableCell>Address</TableCell>
                                                    <TableCell>City</TableCell>
                                                    <TableCell>State</TableCell>
                                                    <TableCell>Zip Code</TableCell>
                                                    <TableCell>Offers</TableCell>
                                                    <TableCell>Status</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {sellerData ? sellerData.slice(pageCount * 10, pageCount * 10 + 10).map((property) =>
                                                    <TableRow key={property.StoreID}>
                                                        <TableCell>{property.StoreName}</TableCell>
                                                        <TableCell>{moment(property.CreatedDate).format("L")}</TableCell>
                                                        <TableCell className="adr-seller">{property.Address}</TableCell>
                                                        <TableCell>{property.City}</TableCell>
                                                        <TableCell>{property.State}</TableCell>
                                                        <TableCell>{property.ZipCode}</TableCell>
                                                        <TableCell>{property.Offers}</TableCell>
                                                        <TableCell>{property.Status}</TableCell>
                                                        <TableCell><Button className="view-btn" onClick={this.sellerProperty.bind(this, property)}>View</Button></TableCell>
                                                    </TableRow>
                                                ) :
                                                    <TableRow></TableRow>
                                                }
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[1]}
                                                        colSpan={9}
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
                                            </TableFooter>
                                        </Table>
                                    </div>
                                </div> :
                                <div>
                                    <Row>
                                        {sellerData.length > 0 ? sellerData.map(property => {
                                            return (
                                                <Col md={4} className="grid-seller-dashboard">

                                                    <Row className="border-box">
                                                        <Col md={12} className="space-top">
                                                            <h5 className="cls-head"><Link onClick={this.sellerProperty.bind(this, property)}> {property.StoreName}</Link></h5>
                                                        </Col>
                                                        <div className="image-with-content">
                                                            <div className="column-divied imageleft">

                                                                {property.StoreImage != null ?
                                                                    <img src={'/StoreImages/' + property.StoreImage} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} alt="img" className="res-img" /> :
                                                                    <img src={no_img} className="res-img" alt="" />}

                                                            </div>
                                                            <div className="column-divied contentright text-center-or" >
                                                                <div>
                                                                    {/* {property.Status === 'Available' ? 'Available' :property.Status === 'Sold'? 'Sale':property.Status==='Due Diligence' ? 'Contract':''} */}
                                                                    {property.Status === 'Available' ? <span className="buttons-status">Available</span> : property.Status === 'Sold' ? <span className="buttons-status-sold">Sale</span> : property.Status === 'Due Diligence' ? <span className="buttons-status-contract">Contract</span> : ''}
                                                                </div>
                                                                <div className="listed-date-dashboard">
                                                                    <h4>Listed Date</h4>
                                                                    {moment(property.CreatedDate).format("MMMM D, YYYY")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Col md={12}>
                                                            <div className="seller-dashboard-address">
                                                                <ul className="listitem">
                                                                    <li>
                                                                        <div className="item">
                                                                            <img src={address_icon} className="dash-img" alt="" />
                                                                            <div class="content"> {property.Address}<br /> {property.City},{property.State}<br />Pin Code:{property.ZipCode}</div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className="offer-btn">
                                                                <Link onClick={this.sellerProperty.bind(this, property)}> Offer: {property.Offers}</Link>

                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            )
                                        }) : <Col><div className="no-property">No properties found.</div></Col>}
                                    </Row>
                                </div>
                            }


                        </div> :
                        <Row className="seller-dash-head">
                            <Col md={12}>
                                <div className="heading">
                                    <h5>Properties <span>Listed</span></h5>
                                    <div><span className="heading-broder"></span></div>
                                </div>
                                <br />
                                <Row><Col className="no-seller-list">No properties available</Col></Row>
                            </Col>
                        </Row>

                    }

                </div>
            </main >
        );
    }
}
