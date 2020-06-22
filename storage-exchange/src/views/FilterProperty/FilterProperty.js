import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { CONFIG } from '../../Utils/config';
import { getFormattedInt, getPager } from "../../Utils/utils";
import axios from 'axios';
import './FilterProperty.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Row, Col, Button, FormGroup, Input, Container } from 'reactstrap';
import base64 from 'react-native-base64'
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';

import { Multiselect } from 'multiselect-react-dropdown';
import 'react-input-range/lib/css/index.css';
import InputRange from 'react-input-range';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import search_lens from './../../Assets/Img/search-lens.png';
import search_icon from './../../Assets/Img/search.png';
import fliter_icon from './../../Assets/Img/fliter.png';
import map_icon from './../../Assets/Img/map-icon.png';
import list_icon from './../../Assets/Img/list.png';
import feature_home from './../../Assets/Img/noimglist.png';
import banner_src from './../../Assets/Img/logo-white.png';
import address_f from './../../Assets/Img/location-black.png';
import arrow_f from './../../Assets/Img/arrow.png';
import long_f from './../../Assets/Img/aroow-icon.png';
import price_f from './../../Assets/Img/price.png';
import { MapView } from '../MapView';


export default class FilterProperty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            pSearchResult: undefined,
            propertyNameList: [],
            orderBy: '1-ASC',
            defaultorderBy: '1-ASC',
            isList: true,
            userInput: '',
            showPropertyNameList: false,
            page: 1,
            pageLength: 10,
            pageCount: 0,
            selectedStoreType: [],
            storeTypeList: [],
            selectedStates: [],
            stateList: [],
            priceMax: 50000000,
            areaMax: 10000000,
            priceMin: 0,
            areaMin: 0,
            city: '',
            filter: {
                storeTypeIDs: '',
                stateIDs: '',
                priceStart: 0,
                priceEnd: 50000000,
                areaStart: 0,
                areaEnd: 10000000,
                storeTypeNames: '',
                stateCodes: '',
                city: '',
            },
            isFilterApplied: false,
            area: {
                min: 0,
                max: 10000000,
            },
            price: {
                min: 0,
                max: 50000000,
            },
            pager: undefined,
        };
        this.handleKeyChange = this.handleKeyChange.bind(this);
        this.searchClick = this.searchClick.bind(this);
        this.handleOrderByChange = this.handleOrderByChange.bind(this);
        this.onPropertyClick = this.onPropertyClick.bind(this);
        this.handleStoreTypeChange = this.handleStoreTypeChange.bind(this);
        this.onStateSelect = this.onStateSelect.bind(this);
        this.onStateRemove = this.onStateRemove.bind(this);
        this.onStoreTypeSelect = this.onStoreTypeSelect.bind(this);
        this.onStoreTypeRemove = this.onStoreTypeRemove.bind(this);
        this.handlePriceSlider = this.handlePriceSlider.bind(this);
        this.multiselectRef = React.createRef();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePriceInputRangeChange = this.handlePriceInputRangeChange.bind(this);
        this.handleAreaInputRangeChange = this.handleAreaInputRangeChange.bind(this);
        this.initializeFilterObject = this.initializeFilterObject.bind(this);
        this.resetValues = this.resetValues.bind(this);
        this.resetFilterValues = this.resetFilterValues.bind(this);
        this.onViewChange = this.onViewChange.bind(this);
        this.getData = this.getData.bind(this);
        this.onKeyFocus = this.onKeyFocus.bind(this);
    }

    componentDidMount() {
        var keyword = '';
        if (this.props.match.params.keyword) {
            keyword = decodeURIComponent(this.props.match.params.keyword);
        }
        this.getLookupValues();
        this.setState({ userInput: keyword }, () => { this.searchClick("search") });
    }

    getData(page) {
        this.setState({ page: page }, () => {
            this.searchClick("page");
        });
    }

    onViewChange(isList) {
        this.setState({ isList });
    }

    initializeFilterObject() {
        let priceStart = 0;
        let priceEnd = 50000000;
        let areaStart = 0;
        let areaEnd = 10000000;

        let filter = {
            storeTypeIDs: '',
            stateIDs: '',
            priceStart: priceStart,
            priceEnd: priceEnd,
            areaStart: areaStart,
            areaEnd: areaEnd,
            storeTypeNames: '',
            stateCodes: '',
            city: ''
        }
        this.setState({ filter })
    }

    handleInputCityChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleInputChange(e) {
        const { area, price } = this.state;
        var areaL = area;
        var priceL = price;

        let targetName = e.target.name;
        let targetValue = e.target.value;

        if (targetName == "areaStart") {
            areaL.min = targetValue;
        } else if (targetName == "areaEnd") {
            areaL.max = targetValue;
        } else if (targetName == "priceStart") {
            priceL.min = targetValue;
        } else if (targetName == "priceEnd") {
            priceL.max = targetValue;
        }
        this.setState({ area: areaL, price: priceL });
    }

    handleAreaInputRangeChange(value) {

    }

    handlePriceInputRangeChange(value) {

    }


    resetValues() {

        this.setState({
            selectedStates: [],
            selectedStoreType: [],
            area: {
                min: 0,
                max: 10000000,
            },
            price: {
                min: 0,
                max: 50000000,
            },
            city: ''
        })
    }

    resetFilterValues() {

        this.setState({
            selectedStates: [],
            selectedStoreType: [],
            area: {
                min: 0,
                max: 10000000,
            },
            price: {
                min: 0,
                max: 50000000,
            },
            isFilterApplied: false,
            isList: true,
            city: ''
        })
        this.initializeFilterObject();

    }

    applyFilters() {

        const { filter, selectedStates, selectedStoreType, price, area, city, defaultorderBy } = this.state;
        let stateID = '';
        let storeTypeID = '';
        let storetypeNames = '';
        let stateCodes = '';

        if (selectedStates.length > 0) {
            selectedStates.map((state) => {
                stateID = stateID + state.ID + ",";
                stateCodes = stateCodes + state.Name + ",";
            });

            stateCodes = stateCodes.substring(0, stateCodes.length - 1);
        }

        if (selectedStoreType.length > 0) {
            selectedStoreType.map((store) => {
                storeTypeID = storeTypeID + store.ID + ",";
                storetypeNames = storetypeNames + store.Name + ",";
            });
            storetypeNames = storetypeNames.substring(0, storetypeNames.length - 1);
        }
        filter.storeTypeIDs = storeTypeID;
        filter.stateIDs = stateID;
        filter.areaEnd = area.max;
        filter.areaStart = area.min;
        filter.priceStart = price.min;
        filter.priceEnd = price.max;
        filter.storeTypeNames = storetypeNames;
        filter.stateCodes = stateCodes;
        filter.city = city;
        this.setState({
            filter, isFilterApplied: true, isList: true, orderBy: defaultorderBy
        }, () => this.searchClick("filter"));
    }

    searchClick(source) {
        const { orderBy, userInput, page, pageLength, filter, isFilterApplied, defaultorderBy } = this.state;
        let isFilterAppliedL = isFilterApplied;
        let orderbyL = orderBy;

        if (source === "search") {
            isFilterAppliedL = false;
            orderbyL = defaultorderBy;
        }
        else {
            isFilterAppliedL = isFilterApplied;
        }
        this.setState({ isLoading: true, showPropertyNameList: false, isFilterApplied: isFilterAppliedL, isList: true, orderBy: orderbyL });

        var oderBySplit = orderbyL.split("-");
        var userInputsplit = userInput.split("-");
        const data = {
            "Keyword": userInputsplit[0],
            "IsShowFull": 1,
            "StoreTypeID": filter.storeTypeIDs,
            "StateID": filter.stateIDs,
            "PriceStart": filter.priceStart,
            "PriceEnd": filter.priceEnd,
            "RentableSQFTStart": filter.areaStart,
            "RentableSQFTEnd": filter.areaEnd,
            "City": filter.city,
            "SortBy": oderBySplit[0],
            "SortOrder": oderBySplit[1],
            "Page": page,
            "PageLength": pageLength

        };
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'home/property/search', data).then(response => {
            if (response.status === 200) {
                var pagination = response.data.Pagination;
                var pagerResult = getPager(pagination.TotalRecords, page, pageLength);

                this.setState({ pSearchResult: response.data.Store, pager: pagerResult, pagination: pagination, isLoading: false, showPropertyNameList: false });
            }
        })
            .catch(err => {
                this.setState({ isLoading: false });
            });
    }

    onKeyFocus() {
        const { showPropertyNameList } = this.state;
        this.setState({ showPropertyNameList: !showPropertyNameList });
    }

    handleKeyChange(e) {
        const userInput = e.currentTarget.value;

        const { orderBy, priceMax, areaMax, priceMin, areaMin, page, pageLength, city } = this.state;
        var oderBySplit = orderBy.split("-");
        this.setState({ userInput });
        if (userInput.length >= 2) {
            const data = {
                "Keyword": userInput,
                "StoreTypeID": null,
                "StateID": null,
                "PriceStart": priceMin,
                "PriceEnd": priceMax,
                "RentableSQFTStart": areaMin,
                "RentableSQFTEnd": areaMax,
                "City": city,
                "SortBy": oderBySplit[0],
                "SortOrder": oderBySplit[1],
                "Page": page,
                "PageLength": pageLength

            };
            axios.post(CONFIG.API_URL + 'home/property/search', data).then(response => {
                if (response.status === 200) {
                    this.setState({ propertyNameList: response.data, showPropertyNameList: true });
                }
            })
                .catch(err => {
                    this.setState({ isLoading: false });
                });
        }
    }

    handleOrderByChange(e) {
        let orderBy = e.target.value;
        this.setState({ orderBy }, () => {
            this.searchClick("sorting");
        });
    }

    onPropertyClick(property) {

        let viewallname = property.StoreName;
        const userInput = viewallname.split(":");
        this.setState({ userInput: userInput[1].trim() }, () => {
            this.searchClick("search");
        });
    }

    handleStoreTypeChange(e) {
        this.setState({ selectedStoreType: e.target.value });
    }

    getLookupValues() {

        axios.get(CONFIG.API_URL + 'lookup/store/types').then(response => {
            if (response.status === 200) {
                this.setState({ storeTypeList: response.data, isLoading: false });
            }
        })
            .catch(err => {
                this.setState({ isLoading: false });
            });
        axios.get(CONFIG.API_URL + 'lookup/state').then(response => {
            if (response.status === 200) {
                this.setState({ stateList: response.data, isLoading: false });
            }
        })
            .catch(err => {
                this.setState({ isLoading: false });
            });
    }

    onStateSelect = (event, selectedList, selectedItem) => {
        this.setState({ selectedStates: event });
    }

    onStateRemove = (event, selectedList, removedItem) => {
        this.setState({ selectedStates: event });
    }

    onStoreTypeSelect = (event, selectedList, selectedItem) => {
        this.setState({ selectedStoreType: event });
    }

    onStoreTypeRemove = (event, selectedList, removedItem) => {
        this.setState({ selectedStoreType: event });
    }

    handlePriceSlider = (event, newValue) => {
        let priceSliderValue = event.currentTarget.value;
        this.setState({ priceSliderValue });
    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Property Search';
        const { isLoading, pSearchResult, showPropertyNameList, propertyNameList, orderBy,
            userInput, selectedStoreType, storeTypeList, selectedStates, stateList,
            areaMax, areaMin, priceMin, priceMax, price, area, isFilterApplied, filter, isList,
            pagination, pager, city } = this.state;

        return (
            <React.Fragment>
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <Row className="property-search">
                    <Container-fluid>
                        <div className="item">
                            <img src={search_lens} className="" alt="" />
                            <div class="content"><h2>PROPERTY SEARCH<br /> <span> <Link to="/">Home</Link>/ Property Search</span></h2></div>
                        </div>
                    </Container-fluid>
                </Row>
                <Row className="page-height-fixed">
                    <div className="width-twenty">
                        <div className="filter-field search-side-filter">
                            <h6>Property Search</h6>
                            <form>
                                <div className="box-12">
                                    <React.Fragment>
                                        <input
                                            type="text"
                                            onChange={this.handleKeyChange}
                                            onFocus={this.onKeyFocus}
                                            value={userInput}
                                        />
                                        {showPropertyNameList && userInput ?
                                            <React.Fragment>
                                                <ul class="suggestions">
                                                    {propertyNameList.length > 1 ?
                                                        <React.Fragment>
                                                            {
                                                                propertyNameList.map((property, index) => {
                                                                    if (index === 0) {
                                                                        // return (
                                                                        //     <li key={property.StoreID}>
                                                                        //         <span className="view-all"><Link onClick={() => this.onPropertyClick(property)}> {property.StoreName}</Link></span>
                                                                        //     </li>);
                                                                    } else {
                                                                        return (
                                                                            <li key={property.StoreID}>
                                                                                <span className="view-list-all"> <Link to={"/property/" + property.StoreID + "/" + encodeURIComponent(property.StoreName)} >{property.StoreName + "-" + property.City + "," + property.State}</Link></span>
                                                                            </li>
                                                                        );
                                                                    }
                                                                })
                                                            }
                                                        </React.Fragment>
                                                        : <li class="no-suggestions">
                                                            <em><h6 className="no-records-found-in-filter">No records found</h6></em>
                                                        </li>}
                                                </ul>
                                            </React.Fragment>
                                            : ''}
                                    </React.Fragment>
                                    <div className="search-click">
                                        <Button type="button" className="search-bttn search-button" color="blue" size="lg" onClick={() => this.searchClick("search")}><img src={search_icon} alt="" /></Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <React.Fragment>
                            <div className="filter-field padd-12">
                                <h6>Filters</h6>
                                {/* <div>
                                    {storeTypeList.length > 0 ?
                                        <Multiselect
                                            options={storeTypeList}
                                            selectedValues={selectedStoreType}
                                            onSelect={(e, selectedList, selectedItem) => this.onStoreTypeSelect(e, selectedList, selectedItem)}
                                            onRemove={(e, selectedList, removedItem) => this.onStoreTypeRemove(e, selectedList, removedItem)}
                                            displayValue="Name"
                                            style={this.style}
                                            isObject={true}
                                            placeholder="Property Types"
                                            ref={this.multiselectRef}
                                        />
                                        : ''}
                                </div> */}
                                <div className="margin-top-buyer">
                                    {storeTypeList.length > 0 ?
                                        <Multiselect
                                            options={stateList}
                                            selectedValues={selectedStates}
                                            onSelect={(e, selectedList, selectedItem) => this.onStateSelect(e, selectedList, selectedItem)}
                                            onRemove={(e, selectedList, removedItem) => this.onStateRemove(e, selectedList, removedItem)}
                                            displayValue="Name"
                                            style={this.style}
                                            isObject={true}
                                            placeholder="State"
                                            ref={this.multiselectRef}
                                        />
                                        : ''}
                                </div>
                                <div className="margin-top-buyer">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        onChange={(e) => this.handleInputCityChange(e)}
                                        value={city}
                                        name="city"
                                        className="city-filter"
                                    />
                                </div>

                                <div className="margin-top-buyer">
                                    <Typography id="range-slider" gutterBottom>
                                        Price: ${getFormattedInt(price.min) + "-" + getFormattedInt(price.max)}
                                    </Typography>
                                    <Row className="range-fliter">
                                        <Col>
                                            <InputRange
                                                draggableTrack
                                                maxValue={priceMax}
                                                minValue={priceMin}
                                                onChange={value => this.setState({ price: value })}
                                                //onChangeComplete={(value) => this.handlePriceInputRangeChange(value)}
                                                value={price}
                                                formatLabel={value => `${getFormattedInt(value)}`}
                                            />
                                        </Col>
                                    </Row>

                                    <div className="range-field margin-top-buyer">
                                        <div className="range-left">
                                            <input
                                                type="number"
                                                placeholder="Price Start"
                                                onChange={(e) => this.handleInputChange(e)}
                                                value={price.min}
                                                name="priceStart"
                                            />
                                        </div>
                                        <div className="range-right">
                                            <input
                                                type="text"
                                                placeholder="Price End"
                                                onChange={(e) => this.handleInputChange(e)}
                                                value={price.max}
                                                name="priceEnd"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="margin-top-buyer">
                                    <Typography id="range-slider" gutterBottom>
                                        Area (NRSF): {getFormattedInt(area.min) + "-" + getFormattedInt(area.max)}
                                    </Typography>
                                    <Row className="range-fliter">
                                        <Col>
                                            <InputRange
                                                draggableTrack
                                                maxValue={areaMax}
                                                minValue={areaMin}
                                                onChange={value => this.setState({ area: value })}
                                                //onChangeComplete={(value) => this.handleAreaInputRangeChange(value)}
                                                value={area}
                                                formatLabel={value => `${getFormattedInt(value)}`}
                                            />
                                        </Col>
                                    </Row>
                                    <div className="range-field margin-top-buyer">
                                        <div className="range-left">
                                            <input
                                                type="number"
                                                placeholder="Area Start"
                                                onChange={(e) => this.handleInputChange(e)}
                                                value={area.min}
                                                name="areaStart"
                                            />
                                        </div>
                                        <div className="range-right">
                                            <input
                                                type="text"
                                                placeholder="Area End"
                                                onChange={(e) => this.handleInputChange(e)}
                                                value={area.max}
                                                name="areaEnd"
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="right-button">
                                    <Button className=" clear-button" onClick={this.resetFilterValues.bind(this)}>Clear</Button>
                                    <Button className=" apply-button" onClick={this.applyFilters.bind(this)}>Apply</Button>
                                </div>
                            </div>
                        </React.Fragment >
                    </div>
                    <div className=" filter-gridproperty width-eighty">
                        {
                            (pSearchResult && pSearchResult.length > 0) ?
                                <React.Fragment>
                                    <div className="two-in-one row backbox-shadow">
                                        <div className="show-page ">
                                            {pager ?
                                                <div>
                                                    Showing from {pager.startIndex + 1} to {pager.endIndex + 1}  of {pager.totalItems} Records.
                                                </div>
                                                : ''}
                                        </div>
                                        <div className="selection-field">
                                            <Row> {isList ? <div>
                                                <FormGroup>
                                                    <div className="selectdiv">
                                                        <Input placeholder="OrderBy" bsSize="lg" className="select-range" value={orderBy} onChange={e => this.handleOrderByChange(e)} type="select" name="orderBy" id="orderBy">
                                                            <option key={1 + "ASC"} value={"1-ASC"}>{"Price Low to High"}</option>
                                                            <option key={1 + "DESC"} value={"1-DESC"}>{"Price High to Low"}</option>
                                                            {/* <option key={2 + "DESC"} value={"2-DESC"}>{"Newest to Oldest"}</option>
                                                            <option key={2 + "ASC"} value={"2-ASC"}>{"Oldest to Newest"}</option> */}
                                                            <option key={3 + "DESC"} value={"3-DESC"}>{"Sq.Ft High to Low"}</option>
                                                            <option key={3 + "ASC"} value={"3-ASC"}>{"Sq.Ft Low to High"}</option>
                                                        </Input>
                                                    </div>
                                                </FormGroup>
                                            </div> : ''}
                                                <div className="grid-view">
                                                    <Link to="#" onClick={() => this.onViewChange(!isList)}>{isList ? <span><img src={map_icon} alt="" /> Map View</span> : <span><img src={list_icon} className="listicon" alt="" /> List View</span>}</Link>
                                                </div>
                                            </Row>
                                        </div>
                                    </div>
                                    <Row className="col-md-12 filter-para">
                                        {isFilterApplied && isList && (filter.storeTypeNames != '' || filter.stateCodes != '' || (filter.priceStart != priceMin || filter.priceEnd != priceMax) || (filter.areaStart != areaMin || filter.areaEnd != areaMax) || filter.city != '')
                                            ?
                                            <React.Fragment>
                                                {filter.storeTypeNames != '' ? <span className="type-background">Property Types: {filter.storeTypeNames}</span> : ''}
                                                {filter.stateCodes != '' ? <span className="type-background">State: {filter.stateCodes}</span> : ''}
                                                {filter.city != '' ? <span className="type-background">City: {filter.city}</span> : ''}
                                                {(filter.priceStart != priceMin || filter.priceEnd != priceMax) ? <span className="type-background">Price: {filter.priceStart + "-" + filter.priceEnd}</span> : ''}
                                                {(filter.areaStart != areaMin || filter.areaEnd != areaMax) ? <span className="type-background">Area(NRSF): {filter.areaStart + "-" + filter.areaEnd}</span> : ''}
                                            </React.Fragment>
                                            : ''}
                                    </Row>
                                    {isList ?
                                        <div className="content-side">
                                            <div className="item-list-property scrollbar" id="style-2">
                                                {pSearchResult.map(stores => {
                                                    return (
                                                        <Row className="list-property">
                                                            <Col md={4} className="list-img">
                                                                {stores.StoreImage != null ?
                                                                    <img src={'/StoreImages/' + stores.StoreImage} onError={(e) => { e.target.onerror = null; e.target.src = feature_home }} alt="img" /> :
                                                                    <img src={feature_home} className="" alt="" />}
                                                                <div class="type-container tags-position-fliter">
                                                                    {stores.StatusID == 3 ? <div class="estate-type">Under Contract</div> :
                                                                        stores.StatusID == 1 ? <div class="transaction-type">On Sale</div> :
                                                                            <div class="sold-type">Sold</div>}
                                                                </div>
                                                            </Col>
                                                            <Col md={8}>
                                                                <h5><Link to={"/property/" + stores.StoreID + "/" + encodeURIComponent(stores.StoreName)} >{stores.StoreName}</Link></h5>
                                                                <div className="list-box-height">
                                                                    <ul className="listitem">
                                                                        <li>
                                                                            <div className="item">
                                                                                <img src={address_f} alt="" />
                                                                                <div class="content"> {stores.Address1}, {stores.City}, {stores.State}, Zip Code: {stores.ZipCode}</div>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                    <p><img src={arrow_f} className="image-listview-fliter" alt="" /> <span>Area:</span> {stores.RentableSQFT ? stores.RentableSQFT + " Sq.Ft" : stores.Acerage + " Acre(s)"}</p>
                                                                    <p><img src={price_f} className="image-listview-fliter" alt="" /> <span>Price:</span> ${getFormattedInt(stores.Price)} </p>
                                                                </div>
                                                                <Link className="moreinfo-property" to={"/property/" + stores.StoreID + "/" + encodeURIComponent(stores.StoreName)} >More Info</Link>
                                                            </Col>
                                                        </Row>
                                                    );
                                                })}
                                            </div>
                                            {pager ?
                                                <Row className="page-count">
                                                    <div className="col-md-12">
                                                        <div id="menu-outer">
                                                            <div class="table">
                                                                <ul id="horizontal-list">

                                                                    {pager.currentPage == pager.startPage ?
                                                                        <React.Fragment>
                                                                            <li className="disable-page">{"<<"}</li>
                                                                            <li className="disable-page">{"<"}</li>
                                                                        </React.Fragment> :
                                                                        <React.Fragment>
                                                                            <li><a aria-current="true" className="active-page" onClick={() => this.getData(pager.startPage)}>{"<<"}</a></li>
                                                                            <li><a aria-current="true" className="active-page" onClick={() => this.getData(pager.currentPage - 1)}>{"<"}</a></li>
                                                                        </React.Fragment>
                                                                    }
                                                                    {pager.pages.map((page, index) => {
                                                                        return (
                                                                            <li key={page} className={pager.currentPage == page ? "pageactive" : ""}>
                                                                                <a onClick={() => this.getData(page)}>{page}</a>
                                                                            </li>
                                                                        )
                                                                    })}
                                                                    {pager.currentPage == pager.endPage ?
                                                                        <React.Fragment>
                                                                            <li>{">"}</li>
                                                                            <li>{">>"}</li>
                                                                        </React.Fragment> :
                                                                        <React.Fragment>
                                                                            <li><a onClick={() => this.getData(pager.currentPage + 1)}>{">"}</a></li>
                                                                            <li><a onClick={() => this.getData(pager.endPage)}>{">>"}</a></li>
                                                                        </React.Fragment>
                                                                    }

                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Row>
                                                : ''}</div> :
                                        <MapView StoreDetails={pSearchResult} />
                                    }

                                </React.Fragment>
                                : <h6 className="no-records-found-in-filter">No results found</h6>
                        }
                    </div>
                </Row>

            </React.Fragment >
        )
    }
}