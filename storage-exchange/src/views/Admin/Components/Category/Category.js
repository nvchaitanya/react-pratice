import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../../../Utils/config';
import { Link, Route, withRouter } from "react-router-dom";
import moment from 'moment';
import { Label, Input } from 'reactstrap';
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
import deleteicon from '../../../../Assets/Img/delete.png';
import restoreicon from '../../../../Assets/Img/restore-icon.png';
import editicon from '../../../../Assets/Img/edit.png';
import './Category.css';

const actionsStyles = theme => ({
    tablepaggination: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing * 2.5,
    },
});

class CategoryTable extends React.Component {

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

const CategoryTableWrapped = withStyles(actionsStyles, { withTheme: true })(
    CategoryTable,
);

export default class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            addModal: false,
            categoryList: [],
            categoryData: [],
            primaryCategoryList: [],
            pageCount: 0,
            userType: 2,
            addCategoryModal: false,
            selectedPrimaryCategory: []
        }
    }

    addtoggleModal(category) {
        let categoryData;
        let primaryCategory;

        if (category == 0) {
            categoryData = { 'Name': '' };
            primaryCategory = { 'ID': 0, 'Name': '' };
        }
        else {
            categoryData = category;
            primaryCategory = { 'ID': category.PrimaryCategoryID, 'Name': category.PrimaryCategoryName };
        }

        this.setState(state => ({ addModal: !state.addModal, categoryData: categoryData, selectedPrimaryCategory: primaryCategory }));
    }

    addCategory(event, errors, values) {
        if (errors.length > 0) {
            console.log(errors);
        }
        else {
            const data = {
                "ID": this.state.categoryData.length === 0 ? 0 : this.state.categoryData.ID,
                "Name": values.CategoryName,
                "PrimaryCategoryID": this.state.selectedPrimaryCategory.ID,
                "Level": this.state.selectedPrimaryCategory.ID === 0 ? 1 : 2
            }

            // let token = localStorage.getItem('accessKey');
            // if (token) {
            //     axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            // }

            axios.post(CONFIG.API_URL + 'admin/category/', data)
                .then(res => {
                    this.myFormRef && this.myFormRef.reset();
                    this.state.categoryList.Criteria.Page = 1;
                    this.getDetails(null);
                    this.toggleClose();
                })
                .catch((err) => {
                    console.log(err);
                    
                    alert(err.response.data);
                })
        }
    }

    toggleClose = () => this.setState(state => ({ addModal: false }))

    getDetails(params) {        
        this.setState({ isLoading: true });
        if (params == null) {
            params = this.state.categoryList.Criteria;
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/categories', params)
            .then(res => {
                let categoryList = res.data;
                this.setState({ isLoading: false, categoryList })
            })
            .catch((err) => {
                this.setState({ isLoading: false });
                console.log(err);
            })
    }

    deleteCategory(id) {
        confirmAlert({
            title: 'Delete Cateory',
            message: 'Are you sure want to delete this category?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        let token = localStorage.getItem('accessKey');
                        if (token) {
                            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
                        }
                        axios.delete(CONFIG.API_URL + 'admin/category/' + id)
                            .then(res => {
                                this.getDetails(null);
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

    restoreCategory(id) {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.request({
            url: CONFIG.API_URL + 'admin/category/' + id,
            method: 'put',
        })
            .then(res => {
                this.getDetails(null);
            })
            .catch(err => {
                this.setState({ isLoading: false });
                if (err.response != null && err.response.status === 400) {
                    const searchError = err.response.data;
                    this.setState({ searchError });
                }
                else {
                    const searchError = "Something went wrong.";
                    this.setState({ searchError });
                }
            });
    }

    addtoggleChildCategoryModal() {
        this.setState(state => ({ addCategoryModal: !state.addCategoryModal }));
        const params = {
            'Level': 1,
            'Page': 1,
            'PageLength': CONFIG.PAGE_LENGTH
        }

        this.getPrimaryCategories(params);
    }

    getPrimaryCategories(params) {
        if (params == null) {
            params = this.state.primaryCategoryList.Criteria;
        }

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }

        axios.post(CONFIG.API_URL + 'admin/categories/level', params)
            .then(res => {
                let primaryCategoryData = res.data;
                this.setState(state => ({ primaryCategoryList: primaryCategoryData }));
            })
            .catch((err) => {
                console.log(err);
            })
    }

    search(event, errors, values) {
        if (errors.length === 0) {
            this.setState({ isLoading: true });
            const params = {
                'Name': values.Name,
                'PageLength': CONFIG.PAGE_LENGTH,
                'Page': 1
            }

            this.getDetails(params);
        }
    }

    selectPrimaryCategory(category) {
        let selectedPrimaryCategory = category;
        this.setState({ selectedPrimaryCategory, addCategoryModal: false });
    }

    toggleClose = () => this.setState(state => ({ addModal: false, addCategoryModal: false, addMessageModal: false }))

    toggleCategoryClose() {
        this.setState(state => ({ addCategoryModal: false }))
    }

    componentDidMount() {
        this.getDetails(this.initialParam());
    }

    initialParam() {
        const params = {
            'Name': '',
            'Page': 1,
            'PageLength': CONFIG.PAGE_LENGTH
        }

        return params;
    }

    resetSearch() {
        this.myFormSearch && this.myFormSearch.reset();
        this.getDetails(this.initialParam());
    }

    handleChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.categoryList.Criteria.Page = pageCount + 1;
        this.getDetails(null);
    };

    handlePrimaryChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
        this.state.primaryCategoryList.Criteria.Page = pageCount + 1;
        this.getPrimaryCategories(null);
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Category Search';
        const { isLoading, pageCount, categoryList, categoryData, primaryCategoryList, selectedPrimaryCategory } = this.state;

        return (
            <main className="dashboard-layout-height background-clr-admin">
             {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
            <div className="category-search-list">
                <div className="category-admin leftandright-nomargin">
                    <div className="heading">
                        <h5>Category </h5>
                        {/* <div><span className="heading-broder"></span></div> */}
                    </div>

                    <div className="category-form-admin form-back-shadow">
                        <AvForm onSubmit={this.search.bind(this)} ref={c => (this.myFormSearch = c)}>
                            <Row>
                                <Col md={6}>
                                    <AvField name="Name" label="Category Name" />
                                </Col>
                                <Col md={6} className="btn-search">
                                    <Button id="btn" className="search-butn" color="primary">Search</Button>
                                    <Button onClick={this.resetSearch.bind(this)} className="btn-reset">Reset</Button>
                                </Col>
                            </Row>
                        </AvForm>
                    </div>
                </div>
                <Row>
                    <Col md={6} className="total-numb">
                    {categoryList.Categories && categoryList.Categories.length > 0 ? <p>Total Categories: {categoryList.Pagination.TotalRecords}</p> : ''}
                    </Col>
                    <Col md={6} className="add-new-btn">
                        <Link onClick={this.addtoggleModal.bind(this, 0)} >[+] Add New Category</Link>
                    </Col>
                </Row>

                <div className="table-model">
                    <Col>
                        {categoryList.Categories && categoryList.Categories.length > 0 ?
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category Name</TableCell>
                                        <TableCell>Primary Category</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryList.Categories ? categoryList.Categories.map((category) =>
                                        <TableRow key={category.ID}>
                                            {/* <TableCell>{moment(buyer.CreatedDate).format("L")}</TableCell> */}
                                            <TableCell>{category.Name}</TableCell>
                                            <TableCell>{category.PrimaryCategoryName}</TableCell>
                                            <TableCell>
                                                <Button className="no-button-background" onClick={this.addtoggleModal.bind(this, category)}><img src={editicon} alt="edit" title="Edit" /></Button>

                                                {category.IsActive == true ?
                                                    <Button className="no-button-background" onClick={this.deleteCategory.bind(this, category.ID)}><img src={deleteicon} alt="delete" title="Delete" /></Button> :
                                                    <Button className="no-button-background" onClick={this.restoreCategory.bind(this, category.ID)}><img src={restoreicon} alt="restore" title="restore" /></Button>
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
                                            colSpan={3}
                                            count={categoryList.Categories ? categoryList.Pagination.TotalRecords : 0}
                                            rowsPerPage={CONFIG.PAGE_LENGTH}
                                            page={pageCount}
                                            SelectProps={{
                                                native: true,
                                            }}
                                            onChangePage={this.handleChangePageTrack}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                            ActionsComponent={CategoryTableWrapped}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            : <h6 className="no-records-found">No records found</h6>}
                    </Col>
                </div>
                <div>
                    <Modal size="md" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                        <ModalHeader toggle={this.toggleClose.bind(this)}>{categoryData && categoryData.ID > 0 ? 'Update' : 'Add New'} Category
                        </ModalHeader>
                        <ModalBody className="overflow-scroll basic-details">
                            <AvForm onSubmit={this.addCategory.bind(this)} ref={c => (this.myFormRef = c)}>
                                <Row>
                                    <Col md={6}>
                                        <AvField name="CategoryName" label="Category Name:" type="text" value={categoryData.Name} validate={{
                                            required: { value: true, errorMessage: 'Category Name is required' }
                                        }} />
                                    </Col>
                                    <Col md={6}>
                                        <Label>Primary Category:</Label><br />
                                        <Button onClick={this.addtoggleChildCategoryModal.bind(this)} className="select-category">Select Category</Button>
                                        <Label className="label-break">{selectedPrimaryCategory.Name}</Label>
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
                <div>
                    <Modal size="md" isOpen={this.state.addCategoryModal} toggle={this.toggleClose.bind(this)} className="create-new edit-market-dashboard">
                        <ModalHeader toggle={this.toggleCategoryClose.bind(this)}>Select Primary Category
                        </ModalHeader>
                        <ModalBody>
                            <div className="table-scroll">
                                {primaryCategoryList.Categories && primaryCategoryList.Categories.length > 0 ?
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Primary Category Name</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {primaryCategoryList.Categories ? primaryCategoryList.Categories.map((category) =>
                                                <TableRow key={category.ID}>
                                                    <TableCell>{category.Name}</TableCell>
                                                    <TableCell>
                                                        <Link className="view-btn-select" onClick={this.selectPrimaryCategory.bind(this, category)} >Select</Link>
                                                    </TableCell>
                                                </TableRow>
                                            ) :
                                                <TableRow><h6 className="no-records-found">No category</h6></TableRow>
                                            }
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TablePagination
                                                    rowsPerPageOptions={[1]}
                                                    colSpan={3}
                                                    count={primaryCategoryList.Categories ? primaryCategoryList.Pagination.TotalRecords : 0}
                                                    rowsPerPage={CONFIG.PAGE_LENGTH}
                                                    page={pageCount}
                                                    SelectProps={{
                                                        native: true,
                                                    }}
                                                    onChangePage={this.handlePrimaryChangePageTrack}
                                                    onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                    ActionsComponent={CategoryTableWrapped}
                                                />
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                    : <h6 className="no-records-found">No records found</h6>}
                            </div>
                        </ModalBody>
                    </Modal>
                </div>

            </div>
            </main>
        );
    }
}
