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
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import vendor_icon from '../../../../Assets/Img/vendor-category.png';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import rightarw from '../../../../Assets/Img/aroow-icon.png';
import plus_icon from '../../../../Assets/Img/plus-icon.png';
import './CategoryList.css';

export default class CategoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            categoryList: [],
            pageCount: 0,
            expanded: false,
            childCategoryList: [],
            error: ''
        };
        this.getCategoryList = this.getCategoryList.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
    }

    getCategoryList(primaryCategoryId) {

        this.setState({ isLoading: true, error: '' });
        axios.get(CONFIG.API_URL + 'category/parent/list/' + primaryCategoryId)
            .then(response => {
                if (response.status === 200) {
                    let data = response.data;
                    if (primaryCategoryId === 0) {
                        this.setState({ isLoading: false, categoryList: data, expanded: false });

                    } else {
                        this.setState({ isLoading: false, childCategoryList: data });
                    }
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

    getFullCategoryList(primaryCategoryId) {

        this.setState({ isLoading: true, error: '' });
        axios.get(CONFIG.API_URL + 'category/full/' + primaryCategoryId)
            .then(response => {
                if (response.status === 200) {
                    let data = response.data;

                    this.setState({ isLoading: false, categoryList: data.categoryList, childCategoryList: data.childCategoryList }, () => {
                        this.setState({ expanded: + primaryCategoryId });
                    });
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

        if (this.props.match.params.parentCategoryID) {
            let parentCategoryID = this.props.match.params.parentCategoryID;
            this.getFullCategoryList(parentCategoryID);
        } else {
            this.getCategoryList(0);
        }
    }

    componentWillReceiveProps(nextprops) {
        this.getCategoryList(0);
    }

    handleChangeCategory(categoryID) {
        if (categoryID != this.state.expanded) {
            this.setState({ expanded: categoryID, childCategoryList: [] });
            this.getCategoryList(categoryID);
        } else {
            this.setState({ expanded: false, childCategoryList: [] });
        }
    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Vendor Listings';
        const { isLoading, categoryList, childCategoryList, expanded, error } = this.state;

        return (
            <div>
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="vendor-category">
                    <Container-fluid>
                        <div className="item">
                            <img src={vendor_icon} className="" alt="" />
                            <div class="content">  <h2>PREFERRED VENDORS <br /> <span> <Link to="/">Home</Link>/ Vendors </span></h2></div>
                        </div>
                    </Container-fluid>
                </div>
                <div className="category-vendor page-height-fixed">
                    <div className="heading">
                        <h3>Preferred Vendors </h3>
                        {/* <div><span className="heading-broder"></span></div> */}
                    </div>
                    {error ? <p className="error-paragraph">{error}</p> : ''}
                    <div className="overflow-scroll-table br-0 category-list">
                        <Row>
                            {categoryList ? categoryList.map((record) =>
                                <Col md={4}>
                                    <ExpansionPanel className="expand-category" expanded={expanded === record.ID} onChange={() => this.handleChangeCategory(record.ID)} key={record.ID}>
                                        <ExpansionPanelSummary className="cate-head"
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={"panel" + record.ID + "-content"}
                                            id={"panel" + record.ID + "-header"}
                                        >
                                            <Typography ><img src={plus_icon} alt="" /> {record.Name}</Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <Typography>
                                                {childCategoryList.length > 0 ? childCategoryList.map((child) =>
                                                    <Table>
                                                        <TableRow key={child.ID}>
                                                            <TableCell><Link to={"/profilelist/" + record.ID + "/" + record.Name + "/" + child.ID + "/" + encodeURI(child.Name)} className="pass-signin"><img src={rightarw} alt="" /> {child.Name}</Link></TableCell>
                                                        </TableRow>
                                                    </Table>
                                                ) : 'No child categories found.'}
                                            </Typography>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                </Col>)
                                : 'No categories found'}
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}
