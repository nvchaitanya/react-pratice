import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../../../Utils/config';
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
import vendor_no from '../../../../Assets/Img/ventor-list.png';
import vendor_icon from '../../../../Assets/Img/vendor-category.png';
import './ProfileList.css';
//import logoPath from '../../../../Assets/VendorLogos';

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

export default class ProfileList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            error: '',
            vendorList: [],
            pageCount: 0,
            parentCategoryID: this.props.match.params.parentCategoryID,
            parentCategoryName: this.props.match.params.parentCategoryName,
            childCategoryID: this.props.match.params.childCategoryID,
            childCategoryName: this.props.match.params.childCategoryName,
        };

    }

    getVendorsList(params) {
        this.setState({ isLoading: true, error: '' });

        axios.post(CONFIG.API_URL + 'vendor/profile/list', params)
            .then(response => {
                if (response.status === 200) {
                    let vendors = response.data;
                    this.setState({ isLoading: false, vendorList: vendors });
                }
            })
            .catch(err => {
                if (err.response != null && err.response.status === 400) {
                    const error = err.response.data;
                    this.setState({ error, isLoading: false });
                }
                else {
                    const error = "Something went wrong.";
                    this.setState({ error, isLoading: false });
                }

            });
    }

    componentDidMount() {
        this.getVendorsList(this.initialParam(0));
        window.scrollTo(0, 0);
    }

    initialParam(page) {
        const params = {
            'Page': page,
            'PageLength': 10,
            'CategoryID': this.state.childCategoryID,
        }

        return params;
    }

    handleChangePageTrack = (event, pageCount) => {

        this.setState({ pageCount });
        this.getVendorsList(this.initialParam(pageCount + 1));
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Vendor Profiles';
        const { isLoading, vendorList, error, pageCount, parentCategoryName, parentCategoryID, childCategoryName } = this.state;

        return (
            <div>
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="vendor-profilelist">
                    <Container-fluid>
                        <div className="item">
                            <img src={vendor_icon} className="" alt="" />
                            <div class="content">  <h2>PREFERRED VENDORS<br /> <span><Link to="/">Home</Link> / <Link to={"/categorylist/" + parentCategoryID}>Vendors</Link>/{parentCategoryName + "-" + childCategoryName} </span></h2></div>
                        </div>
                    </Container-fluid>
                </div>
                <div className="profile-listing page-height-fixed">
                    <div className="heading">
                        <h3>{parentCategoryName + "-" + childCategoryName}</h3>
                        {/* <div><span className="heading-broder"></span></div> */}
                    </div>
                    <Row>
                        {error ? <p className="error-paragraph">{error}</p> : ''}

                        <div className="overflow-scroll-table br-0">
                            {vendorList.Vendors ?
                                <React.Fragment>
                                    
                                    <Row>{vendorList.Vendors ? <p className="total-vendorlist-home">Total Vendors:  {vendorList.Pagination.TotalRecords}</p> : ''}</Row>
                                    < Table className="heading-profilelist">
                                        <TableBody>
                                            {vendorList.Vendors ? vendorList.Vendors.map((record) =>
                                                <a href={record.Website} target="blank"> <TableRow key={record.VendorID} className="tbl-tr">
                                                    <TableCell className="property-list-img">{record.Logo ? <img src={'/VendorLogos/' + record.Logo} alt="img" onError={(e) => { e.target.onerror = null; e.target.src = vendor_no }}></img> : <img src={vendor_no}></img>}</TableCell>
                                                    <TableCell><h5>{record.CompanyName}</h5>
                                                        <p className="para-break">{record.Description}</p>
                                                        <div className="right-read-more">
                                                            {record.Website ?
                                                                <a href={record.Website} target="blank">Read More</a>
                                                                : ''}
                                                        </div>
                                                    </TableCell>
                                                </TableRow></a>

                                            ) :
                                                <TableRow></TableRow>
                                            }
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[1]}
                                                    colSpan={3}
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
                                </React.Fragment>
                                : <Row><Col className="no-featured-stores">No records found</Col></Row>}
                        </div>

                    </Row>
                </div>
            </div >
        );
    }
}
