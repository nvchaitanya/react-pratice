import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalFooter, ModalBody, Container } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
import './DealTracker.css';
import editicon from '../../../../Assets/Img/edit.png';
import { DealViewModal } from '../Shared/DealView';
import view_icon from '../../../../Assets/Img/view.png';

import { getFormattedInt } from '../../../../Utils/utils';

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

class DealTrackerPagination extends React.Component {
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

const DealTrackerWrapped = withStyles(actionsStyles, { withTheme: true })(
  DealTrackerPagination,
);

export default class DealTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isEdit: false,
      dealId: 0,
      storeId: 0,
      buyerId: 0,
      price: 0,
      searchError: '',
      dealList: [],
      pageCount: 0,
      statusId: 0,
      searchStatusId: 0,
      searchStatus: [
        // {
        //     "ID": 0,
        //     "Name": "All"
        // },
        {
          "ID": 6,
          "Name": "NDA Signed"
        },
        {
          "ID": 4,
          "Name": "Evaluation"
        },
        {
          "ID": 1,
          "Name": "Accepted Diligence"
        },
        {
          "ID": 2,
          "Name": "Rejected Diligence"
        }
      ],
      status: [
        {
          "ID": 1,
          "Name": "Accept Diligence"
        },
        {
          "ID": 2,
          "Name": "Reject Diligence"
        },
        {
          "ID": 3,
          "Name": "Sold"
        }
      ],
      deal: {}, isOpen: false,

    };
    this.dealView = React.createRef();
  }

  statusChange(e) {
    var value = e.target.value;
    this.setState({ statusId: value });
    this.updateDealStatus(value);
  }

  searchStatusChange(e) {
    var value = e.target.value;
    this.setState({ searchStatusId: value })
  }

  resetSearch() {
    this.myFormSearch && this.myFormSearch.reset();
    this.searchDeals(this.initialParam());
  }

  searchSubmit(event, errors, values) {
    if (errors.length === 0) {
      const params = {
        'DealName': values.DealName,
        'PropertyName': values.PropertyName,
        'StatusID': this.state.searchStatusId,
        'BuyerName': values.BuyerName,
        'BuyerEmail': values.BuyerEmail,
        'PageLength': CONFIG.PAGE_LENGTH,
        'Page': 1
      }

      this.searchDeals(params);
    }
  }

  searchDeals(params) {
    this.setState({ isLoading: true });
    if (params == null) {
      params = this.state.dealList.Criteria;
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }

    axios.post(CONFIG.API_URL + 'admin/deals', params)
      .then(response => {
        if (response.status === 200) {
          let dealList = response.data;
          this.setState({ isLoading: false, dealList });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  }

  editDeal = (id, storeId, buyerId, price) => {
    this.setState({ isEdit: true, dealId: id, storeId: storeId, buyerId: buyerId, price: price });
  };

  updateDealStatus = (statusId) => {
    confirmAlert({
      title: 'Update Deal Status',
      message: 'Are you sure want to update this deal status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            this.setState({ isLoading: true });
            let token = localStorage.getItem('accessKey');
            if (token) {
              axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }

            let endpoint = '';

            switch (statusId) {
              case 1:
                endpoint = "accept";
                break;

              case 2:
                endpoint = "reject";
                break;

              case 3:
                endpoint = "sold";
                break;

              default: break;
            }

            let data = {
              Id: this.state.dealId,
              StoreId: this.state.storeId,
              BuyerId: this.state.buyerId,
              Price: this.state.price
            }

            axios.post(CONFIG.API_URL + 'admin/deal/' + endpoint, data)
              .then(res => {
                this.setState({ isEdit: false, dealId: 0, storeId: 0, buyerId: 0, price: 0 });
                this.searchDeals(this.initialParam());
              })
              .catch(err => {
                this.setState({ isLoading: false, isEdit: false, dealId: 0, storeId: 0, buyerId: 0, price: 0 });
                console.log(err);
              });
          }
        },
        {
          label: 'No',
          onClick: () => {
            this.setState({ isEdit: false, dealId: 0, storeId: 0, buyerId: 0, price: 0 });
          }
        }
      ]
    });
  };

  componentDidMount() {
    if ((localStorage.getItem('accessKey') == null || localStorage.getItem('accessKey') == '' || localStorage.getItem('role') != 'Admin')) {
      this.props.history.push({
        pathname: "/admin"
      });
    }

    window.scrollTo(0, 0);
    this.searchDeals(this.initialParam());
  }

  initialParam() {
    const params = {
      'DealName': '',
      'PropertyName': '',
      'StatusID': 0,
      'BuyerName': '',
      'BuyerEmail': '',
      'PageLength': CONFIG.PAGE_LENGTH,
      'Page': 1
    }
    return params;
  }

  handleChangePageTrack = (event, pageCount) => {
    this.setState({ pageCount });
    this.state.dealList.Criteria.Page = pageCount + 1;
    this.searchDeals(null);
  };

  handleChangeRowsPerPageTrack = event => {
    this.setState({ pageCount: 0, 10: event.target.value });
  };

  viewDeal(deal) {
    this.dealView.current.getDeal(deal);
  }

  render() {
    document.title = CONFIG.PAGE_TITLE + 'Deal Tracker';
    const { isLoading, isEdit, dealId, searchError, dealList, status, searchStatus, pageCount } = this.state;

    return (
      <main className="dashboard-layout-height ">
        <DealViewModal ref={this.dealView} />
        {isLoading ? <div className="loader-wrap">< div className="page-loading"></div></div> : ''
        }
        <div className="dealtracker-search-list background-clr-admin">
          <div className="dealtracker-listing-dashboard leftandright-nomargin">
            <div className="heading">
              <h5>Deal Tracker</h5>
              {/* <div><span className="heading-broder"></span></div> */}
            </div>
            <div className="dealtracker-form form-back-shadow">
              <AvForm onSubmit={this.searchSubmit.bind(this)} ref={c => (this.myFormSearch = c)}>
                <Row>
                  <Col md={3}>
                    <AvField name="DealName" label="Deal Name" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField name="PropertyName" label="Property Name" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField type="select" name="Status" value={this.state.searchStatusId}
                      onChange={(e) => this.searchStatusChange(e)}
                      label="Status">
                      <option value="0">--Select--</option>
                      {searchStatus ? searchStatus.map(n => {
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
                  <Col md={3}>
                    <AvField name="BuyerName" label="Buyer Name" type="text" />
                  </Col>
                  <Col md={3}>
                    <AvField name="BuyerEmail" label="Buyer Email" type="text" />
                  </Col>
                  <Col md={3} className="btn-search">
                    <Button color="primary" className="search-butn" >Search</Button>
                    <Button onClick={this.resetSearch.bind(this)} className="btn-reset">Reset</Button>
                    <span className="sign-error">{searchError}</span>
                  </Col>
                </Row>
              </AvForm>
            </div>
          </div>
          <Row>
            <Col md={6} className="total-numb">
              {dealList.Deals && dealList.Deals.length > 0 ? <p>Total Deals: {dealList.Pagination.TotalRecords}</p> : ''}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="overflow-scroll-table br-0 table-dealtracker-search table-deal table-model">
                {dealList.Deals && dealList.Deals.length > 0 ?
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Deal</TableCell>
                        <TableCell>Property</TableCell>
                        <TableCell>Buyer</TableCell>
                        <TableCell>Proposed</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dealList.Deals ? dealList.Deals.map((record) =>
                        <TableRow key={record.VendorID}>
                          <TableCell>{moment(record.CreatedDate).format("L")}</TableCell>
                          <TableCell className="word-brk">{record.DealName}</TableCell>
                          <TableCell className="word-brk">{record.StoreName}</TableCell>
                          <TableCell>{record.Buyer}</TableCell>
                          <TableCell>${getFormattedInt(record.Price)}</TableCell>
                          <TableCell>
                            {isEdit == true && dealId === record.ID ?
                              <Select className="select-options" labelId="demo-simple-select-filled-label" id="demo-simple-select-filled"
                                value={this.state.statusId} onChange={(e) => this.statusChange(e)}>
                                <MenuItem value="0">-Select-</MenuItem>
                                {status ? status.map(n => {
                                  return (
                                    <MenuItem key={n.ID} className={n.ID === '' ? "optHead list-select-options" : ''}
                                      disabled={n.ID === '' ? true : false}
                                      value={n.ID}>
                                      {n.Name}
                                    </MenuItem>
                                  );
                                }) : ''}
                              </Select>
                              : record.DealStatus
                            }
                          </TableCell>
                          <TableCell>
                            <div className="disply-dealbtn">
                              <div className="deal-button">
                              {record.DealStatusID === 1 || record.DealStatusID === 4 ?
                              <Button className="" onClick={() => this.editDeal(record.ID, record.StoreID, record.BuyerID, record.Price)}><img src={editicon} alt="edit" title="Edit" /></Button>
                              : ''}
                              </div>
                            <Button type="view" className="no-button-background deal-view-btn" onClick={this.viewDeal.bind(this, record)}><img src={view_icon} alt="view" title="View" /></Button>
                            </div>
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
                          count={dealList.Deals ? dealList.Pagination.TotalRecords : 0}
                          rowsPerPage={CONFIG.PAGE_LENGTH}
                          page={pageCount}
                          SelectProps={{
                            native: true,
                          }}
                          onChangePage={this.handleChangePageTrack}
                          onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                          ActionsComponent={DealTrackerWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                  : <h6 className="no-records-found">No records found</h6>}
              </div>
            </Col>
          </Row>
        </div>
      </main >
    );
  }
}
