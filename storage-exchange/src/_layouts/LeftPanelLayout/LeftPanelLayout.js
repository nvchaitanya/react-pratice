import React from 'react';
import { Link, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import base64 from 'react-native-base64'
import Typography from '@material-ui/core/Typography';
import StarBorder from '@material-ui/icons/StarBorder';
import Toolbar from '@material-ui/core/Toolbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMinusSquare, faPlusSquare, faCaretSquareLeft, faBell } from '@fortawesome/free-solid-svg-icons';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { withStyles } from '@material-ui/core/styles';
//import Logo from './../../Assets/Images/logo.jpg';
import './LeftPanelLayout.css';
import axios from 'axios';
import { CONFIG, USERTYPES } from '../../Utils/config';
import arrow_r from './../../Assets/Img/arrow-right.png';
import signin from './../../Assets/Img/signin-icon.png';
import mail_icon from './../../Assets/Img/mail-blk.png';
import logo_admn from './../../Assets/Img/logo-se.png';
import user_admn from './../../Assets/Img/account-user.png';
import catagorics_admn from './../../Assets/Img/catagorics.png';
import analytics_admn from './../../Assets/Img/analytics.png';
import list1 from './../../Assets/Img/list1.png';
import list2 from './../../Assets/Img/list2.png';
import tracking_admn from './../../Assets/Img/tracking.png';
import user_admin from './../../Assets/Img/user-admin.png';
import admin_arrow from './../../Assets/Img/admin-arrow.png';
import deals_admn from './../../Assets/Img/deals.png';
import logout_admn from './../../Assets/Img/logout-admin.png';
import arrow_buy from './../../Assets/Img/arrow-small.png';
import dash_user from './../../Assets/Img/user-dashboard.png';
import user_notification from './../../Assets/Img/mail.png';
import { getToken, getUserType, getName } from '../../Utils/localStorage';

const drawerWidth = 220;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
        zIndex: 99,
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing * 3,
    },
    marketlayout: {
        background: '#F9F9FA',
        padding: '5px 17px',
        minHeight: 'calc(100vh - 0px)',
    },
    removepadding: {
        padding: '0px',
    },
    myroot: {
        width: '100%',
        maxWidth: 220,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing * 4,
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    card: {
        boxShadow: 'none',
    },
});

class LeftPanelLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            leftMenuData: [],
            dashNavData: [],
            one: true,
            two: false,
            three: false,
            four: true,
            storeId: '',
            showModal: false,
            countlen: null,
            localUserStoreId: null,
            countryCode: '',
            userName: '',
            dealData: [],
            myStoreData: [],
            myDealData: [],
            sellerProperty: [],
            notificationCount: 0,
            localActiveClassSearchName: localStorage.getItem('locSearchName'),
            filterMarketData: [],
            activeMenu: '',
            userType: 0,

        };

        //  this.storeIdReq = this.storeIdReq.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.divRef = React.createRef();
        this.child = React.createRef();
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.refreshHandler1 = this.refreshHandler1.bind(this);
        this.activeClass = this.activeClass.bind(this);

    }

    onShowModal = () => {
        this.setState({ showModal: true })
    }

    activeClass() {
        this.setState({
            // activeClassName: id,
            localActiveClassSearchName: localStorage.getItem('locSearchName')
        });
    }

    handleClick = (index) => {
        if (index === 'one') {
            this.setState(state => ({ one: !state.one }));
        }
        if (index === 'two') {
            this.setState(state => ({ two: !state.two, three: false, activeMenu: 'buyerproperties', activeProperty: '' }));
        }
        if (index === 'three') {
            this.setState(state => ({ three: !state.three, two: false, activeMenu: 'buyerdeals', activeProperty: '' }));
        }
        if (index === 'four') {
            this.setState(state => ({ four: !state.four, activeMenu: 'sellerproperties', activeProperty: '' }));
        }
    };

    tabSection(tab) {
        const { from } = { from: { pathname: "/admin/dashboard/" + tab } };
        this.props.children.props.history.push(from)
    }

    handleClickOpen(e, id) {
        this.child.current.ModalClickOpen(id);
    }

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };



    // to update storeid and call the storeIdReq method
    componentWillReceiveProps(nextProps) {
        if (nextProps.children.props.match.params.storeid && nextProps.children.props.match.path === '/market-dashboard/:storeid/') {
            this.storeIdReq(parseInt(nextProps.children.props.match.params.storeid));
        }
    }



    SessionSignout() {
        let sessionId = parseInt(localStorage.getItem('sessionId'));

        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.post(CONFIG.API_URL + 'home/logout/' + sessionId)
            .then(res => {
                this.props.history.push('/')
                
            })
            .catch((err) => {
                console.log(err)
            })
           
    }


    signOut() {
        this.SessionSignout();
        localStorage.removeItem('accessKey');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('buyerStoreIDs');
        localStorage.removeItem('sessionId');
        this.props.children.props.history.push({
            pathname: `/`
        });
    }


    addClass() {
        this.divRef.current.classList.add('main-div')
    }
    removeClass() {
        this.divRef.current.classList.remove('main-div')
    }


    activeMenu = (menu) => {
        this.setState({ activeMenu: menu, activeProperty: '' });
    }

    getMessage() {
        this.setState({ activeMenu: 'notification', activeProperty: '' });
        let id = localStorage.getItem('id');
        let a = this.props;
        const { from } = { from: { pathname: "/notification/" + id } };
        this.props.children.props.history.push(from)
    }

    getProperties() {
        const { token } = this.state;
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        axios.get(CONFIG.API_URL + 'buyer/stores')
            .then(res => {

                let myStoreData = res.data.MyStores;
                let myDealData = res.data.MyDeals;
                let notificationCount = res.data.UnreadCount;
                this.setState({ myStoreData: myStoreData, myDealData: myDealData, notificationCount: notificationCount });

                //Combine mystoredata and deal data  as (propertyID##buyserStoreID)  and store in localstorage which used in home property view.
                var buyerStoreIDs = "";
                if (myStoreData.length > 0) {
                    buyerStoreIDs = myStoreData.map(element => element.StoreID + "##" + element.BuyerStoreID).join(",");
                }

                if (myDealData.length > 0) {
                    if (buyerStoreIDs != "") {
                        buyerStoreIDs += ",";
                    }
                    buyerStoreIDs += myDealData.map(element => element.StoreID + "##" + element.BuyerStoreID).join(',');
                }
                localStorage.setItem('buyerStoreIDs', buyerStoreIDs);
            })
            .catch((err) => {
                console.log(err)
                this.props.history.push('/signin')
            })
    }

    getUnreadMesCount() {
        const { token } = this.state;
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        axios.get(CONFIG.API_URL + 'home/message/unread')
            .then(res => {
                //debugger;
                let notificationCount = res.data;
                this.setState({ notificationCount: notificationCount });

                //Combine mystoredata and deal data  as (propertyID##buyserStoreID)  and store in localstorage which used in home property view.
            })
            .catch((err) => {
                this.props.history.push('/')
            })
    }

    getSellerProperties() {
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'seller/stores')
            .then(res => {
                let sellerProperty = res.data.Stores;
                let notificationCount = res.data.UnreadCount;
                this.setState({ sellerProperty: sellerProperty, notificationCount: notificationCount });
            })
            .catch((err) => {
                this.props.history.push('/')

            })
    }



    componentDidMount() {
        var token = getToken();
        var userType = getUserType();
        var name = getName();
        this.setState({ token, name, userType }, () => {
            this.getUnreadMesCount();
            if (userType == USERTYPES.Buyer) {
                this.getProperties();
            }
            else if (userType == USERTYPES.Seller) {
                this.getSellerProperties();
            }
            else {
                this.setState({ activeMenu: 'buyer' })
            }

        });

    }

    refreshHandler1() {
        this.componentDidMount();
    }

    propertyView = (property, user) => {
        var path = '';
        let menu = '';
        const { activeMenu } = this.state;

        if (user == 'buyer') {
            path = "/buyer/property/";
            menu = activeMenu;
        } else {
            path = "/seller/property/";
            menu = "sellerproperties";
        }


        this.setState({ activeProperty: property.StoreID, activeMenu: menu })

        let pathName = path + property.StoreID + "/" + property.StoreName;
        const { from } = { from: { pathname: pathName } };
        this.props.children.props.history.push(from)
    }

    render() {
        const { leftMenuData, dashNavData, userName, isPaid, StrId, notificationCount, tempNoStoreCount, countlen, localUserStoreId, localActiveClassSearchName, filterMarketData, dealData,
            myStoreData, myDealData, sellerProperty, token, name, userType, activeMenu, activeProperty } = this.state;

        const { classes, theme } = this.props;
        const drawer = (
            <div className="left-sidebar">
                <div id="r1" onClick={this.refreshHandler1}></div>
                <div id="divbuyer" onClick={() => this.activeMenu('buyer')}></div>
                <div id="divseller" onClick={() => this.activeMenu('seller')}></div>
                <div id="divadmin" onClick={() => this.activeMenu('admin')}></div>

                
                <div className="admin-logo">
                    <Link to="/" >
                        <img src={logo_admn} className="logo" alt="" />
                    </Link>
                </div>
                <Divider />
                <List className="remove-padding" onClick={() => this.activeMenu("myaccount")}>
                    <Link to="/my-account" >
                        <ListItem button className="set-padding menu-padd">
                            <ListItemIcon className="img-icon">
                                <img src={user_admin} className="logo" alt="" />
                            </ListItemIcon>
                            <ListItemText className={activeMenu == "myaccount" || this.props.children.props.match.path == "/my-account" ? "list-item-text panel-active" : "list-item-text"} inset primary="My Account" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <List className="remove-padding">
                    <Link onClick={this.getMessage.bind(this)} >
                        <ListItem button className="set-padding menu-padd">
                            <ListItemIcon className="img-icon">
                                <img src={user_notification} className="logo" alt="" />
                            </ListItemIcon>
                            <ListItemText className={activeMenu == "notification" || this.props.children.props.match.path == "/notification/:id" ? "list-item-text panel-active" : "list-item-text"} inset primary="Notifications" />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
                <div>
                    {userType == USERTYPES.Admin ?
                        <div>
                            <List>
                                <Link to="/admin/dashboard/1" className="remove-padding">
                                    <ListItem
                                        button
                                        onClick={() => this.handleClick('one')}
                                        className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={user_admn} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className="list-item-text" inset primary="User Management" />
                                        {this.state.one ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}

                                    </ListItem>
                                </Link>

                                <Collapse in={this.state.one} timeout="auto" unmountOnExit className="left-sub-menu">
                                    <List className="remove-padding" onClick={() => this.activeMenu('buyer')}>
                                        <Link to="/admin/dashboard/1">
                                            <ListItem button onClick={() => this.tabSection(1)} className="set-padding menu-padd">
                                                <ListItemIcon className="user-manage-icon">
                                                    <img src={admin_arrow} className="logo" alt="" />
                                                </ListItemIcon>
                                                <ListItemText className={activeMenu == "buyer" && this.props.children.props.location.pathname == "/admin/dashboard/1" || this.props.children.props.match.path == "/viewbuyer/:buyerId/" ? "list-item-text panel-active" : "list-item-text"} inset primary="Buyer" />
                                            </ListItem>
                                        </Link>
                                    </List>
                                    <List className="remove-padding" onClick={() => this.activeMenu('seller')}>
                                        <Link to="/admin/dashboard/2">
                                            <ListItem button onClick={() => this.tabSection(2)} className="set-padding menu-padd">
                                                <ListItemIcon className="user-manage-icon">
                                                    <img src={admin_arrow} className="logo" alt="" />
                                                </ListItemIcon>
                                                <ListItemText className={activeMenu == "seller" || this.props.children.props.location.pathname == "/admin/dashboard/2" || this.props.children.props.match.path == "/viewseller/:sellerId/" ? "list-item-text panel-active" : "list-item-text"} inset primary="Seller" />
                                            </ListItem>
                                        </Link>
                                    </List>
                                    <List className="remove-padding" onClick={() => this.activeMenu('admin')}>
                                        <Link to="/admin/dashboard/3">
                                            <ListItem button onClick={() => this.tabSection(3)} className="set-padding menu-padd">
                                                <ListItemIcon className="user-manage-icon">
                                                    <img src={admin_arrow} className="logo" alt="" />
                                                </ListItemIcon>
                                                <ListItemText className={activeMenu == "admin" || this.props.children.props.location.pathname == "/admin/dashboard/3" ? "list-item-text panel-active" : "list-item-text"} inset primary="Admin" />
                                            </ListItem>
                                        </Link>
                                    </List>
                                </Collapse>
                            </List>
                            <Divider />
                            <List className="remove-padding" onClick={() => this.activeMenu('propertylistings')}>
                                <Link to="/admin/properties" >
                                    <ListItem button className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={list1} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className={activeMenu == "propertylistings" || this.props.children.props.match.path == "/admin/properties" ? "list-item-text panel-active" : "list-item-text"} inset primary="Property Listings" />
                                    </ListItem>
                                </Link>
                            </List>
                            <Divider />
                            <List className="remove-padding" onClick={() => this.activeMenu('categories')}>
                                <Link to="/admin/category" >
                                    <ListItem button className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={catagorics_admn} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className={activeMenu == "categories" || this.props.children.props.match.path == "/admin/category" ? "list-item-text panel-active" : "list-item-text"} inset primary="Categories" />
                                    </ListItem>
                                </Link>
                            </List>
                            <Divider />
                            <List className="remove-padding" onClick={() => this.activeMenu('dealtracker')}>
                                <Link to="/admin/dealtracker" >
                                    <ListItem button className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={tracking_admn} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className={activeMenu == "dealtracker" || this.props.children.props.match.path == "/admin/dealtracker" ? "list-item-text panel-active" : "list-item-text"} inset primary="Deal Tracker" />
                                    </ListItem>
                                </Link>
                            </List>
                            <Divider />
                            <List className="remove-padding" onClick={() => this.activeMenu('vendorlistings')}>
                                <Link to="/admin/vendors">
                                    <ListItem button className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={list2} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className={activeMenu == "vendorlistings" || this.props.children.props.match.path == "/admin/vendors" ? "list-item-text panel-active" : "list-item-text"} inset primary="Vendor Listings" />
                                    </ListItem>
                                </Link>
                            </List>
                            <Divider />
                            <List className="remove-padding" onClick={() => this.activeMenu('analytics')}>
                            <Link to="/admin/analytics/1" >
                                    <ListItem button className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={analytics_admn} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className={activeMenu == "analytics" || this.props.children.props.match.path == "/admin/analytics" ? "list-item-text panel-active" : "list-item-text"} inset primary="Analytics" />
                                    </ListItem>
                                </Link>
                            </List>
                        </div>
                        : ''
                    }
                </div>
                <div>
                    {userType == USERTYPES.Buyer ?
                        <div>
                            <List className="remove-padding">
                                <Link to="#" className="remove-padding">
                                    <ListItem
                                        button
                                        onClick={() => this.handleClick('two')}
                                        className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={list1} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className="list-item-text" inset primary="Properties" />
                                        {this.state.two ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}

                                    </ListItem>
                                </Link>
                                <Divider />
                                <Collapse in={this.state.two} timeout="auto" unmountOnExit className="left-sub-menu">
                                    {myStoreData ? myStoreData.map((property) =>
                                        <ul className="left-icon-buyer">
                                            <li className="first-property">{/*<img src={arrow_buy} className="logo buy-icon" alt="" />*/}{property.StoreName}</li>
                                            <ul className="icon-buyers">
                                                <li><Link onClick={() => this.propertyView(property, 'buyer')} className={activeMenu == "buyerproperties" && activeProperty == property.StoreID || this.props.children.props.match.url == "/buyer/property/" + property.StoreID ? "panel-active" : ""} >Profile</Link></li>
                                                <li> Market Report</li>
                                            </ul>

                                        </ul>
                                    ) :
                                        <ul className="left-icon-buyer">
                                            <li className="first-property"><Link>"No Properties Found"</Link></li>
                                        </ul>
                                    }
                                </Collapse>
                            </List>
                            <List className="remove-padding">
                                <Link to="#" className="remove-padding">
                                    <ListItem
                                        button
                                        onClick={() => this.handleClick('three')}
                                        className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={deals_admn} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className="list-item-text" inset primary="Deals" />
                                        {this.state.three ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                                    </ListItem>
                                </Link>
                                <Collapse in={this.state.three} timeout="auto" unmountOnExit className="left-sub-menu">
                                    {myDealData ? myDealData.map((property) =>
                                        <ul className="left-icon-buyer">
                                            <li className="first-property">{/*<img src={arrow_buy} className="logo buy-icon" alt="" />*/}{property.StoreName}</li>
                                            <ul className="icon-buyers">
                                                <li><Link onClick={() => this.propertyView(property, 'buyer')} className={activeMenu == "buyerdeals" && activeProperty == property.StoreID || this.props.children.props.match.url == "/buyer/property/" + property.StoreID ? "panel-active" : ""}>Profile</Link></li>
                                                <li>Market Report</li>
                                            </ul>
                                        </ul>
                                    ) :
                                        <ul className="left-icon-buyer">
                                            <li className="first-property"><Link>"No Properties Found"</Link></li>
                                        </ul>
                                    }

                                </Collapse>
                            </List>

                        </div>
                        : ''
                    }
                </div>
                <div>
                    {/* seller leftpanel */}
                    {userType == USERTYPES.Seller ?
                        <div>
                            <List>
                                <Link to="/seller/dashboard/" className="remove-padding">
                                    <ListItem
                                        button
                                        onClick={() => this.handleClick('four')}
                                        className="set-padding menu-padd">
                                        <ListItemIcon className="img-icon">
                                            <img src={list1} className="logo" alt="" />
                                        </ListItemIcon>
                                        <ListItemText className="list-item-text" inset primary="Listed Properties" />
                                        {this.state.four ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}
                                    </ListItem>
                                </Link>
                                <Collapse in={this.state.four} timeout="auto" unmountOnExit className="left-sub-menu">
                                    {sellerProperty ? sellerProperty.map((property) =>
                                        <ul className="left-icon-buyer">
                                            <li><img src={arrow_buy} className="logo buy-icon" alt="" /><Link className={activeProperty == property.StoreID || this.props.children.props.match.url == "/seller/property/" + property.StoreID ? "panel-active" : ""} onClick={() => this.propertyView(property, 'seller')} >{property.StoreName}</Link></li>
                                        </ul>
                                    ) :
                                        <ul className="left-icon-buyer">
                                            <li className="first-property"><Link>"No Properties Found"</Link></li>
                                        </ul>
                                    }

                                </Collapse>
                            </List>
                        </div>
                        : ''
                    }
                </div>
                <Divider />
                <div>
                    <Link to="/" onClick={this.signOut.bind(this)} className="remove-padding">
                        <ListItem button className="set-padding  menu-padd">
                            <ListItemIcon className="img-icon">
                                <img src={logout_admn} className="logo" alt="" />
                            </ListItemIcon>
                            <ListItemText className="list-item-text" inset primary="Logout" />
                        </ListItem>
                    </Link>
                </div>
            </div>
        );
        return (
            <div className={classes.root}>
                <Hidden smUp>
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </Hidden>
                <nav className={classes.drawer} id="left-nav-bar">
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={`${this.props.classes.content} ${this.props.classes.leftpanellaypot}`}>
                    <div className="header-admin">
                        <Container-fluid>
                            <div className="row">
                                <div className="col-md-3 admin-left">
                                    {userType != USERTYPES.Admin ?
                                        <h6><img src={arrow_r} alt="" /> <Link to="/">Go to Search</Link></h6>

                                        : ''} </div>
                                <div className="col-md-9 admin-right">
                                    <ul>
                                        <li><img src={mail_icon} className="img-dashboard" alt="" onClick={this.getMessage.bind(this)} />
                                            {/* <span class="count-symbol color-circle"></span> */}
                                            <span className={notificationCount > 0 ? "count-symbol color-circle-condition" : "count-symbol color-circle"}></span>
                                        </li>
                                        {/* <li><img src={bell_icon} className="img-dashboard" alt="" />
                                            <span class="count-symbol bg-warning"></span></li>*/}
                                        <li><h6><img src={dash_user} alt="" />
                                            {'Welcome' + ' ' + name}</h6></li>
                                    </ul>
                                </div>
                            </div>
                        </Container-fluid>
                    </div>
                    <Hidden smUp><div className={classes.toolbar} /></Hidden>
                    {this.props.children}

                    <div className="footer-admin">
                        <Container-fluid>
                            <div className="row footer-bottom">
                                <div className="col-md-7">
                                    <p> © Copyright 2020 Aggregate Intelligence - All Rights Reserved</p>
                                </div>
                                <div className="col-md-5 footer_right">
                                    <Link to="/" >Privacy Policy</Link> | <Link to="/" >Terms of use</Link>
                                </div>
                            </div>
                        </Container-fluid>
                    </div>
                </main>
                {/* <AddMarketcmpopup parentMethod1={this.refreshHandler1} parm={this.props} ref={this.child} /> */}
            </div>
        );
    }
}

// LeftPanelLayout.propTypes = {
//     classes: PropTypes.object.isRequired,
//     // Injected by the documentation to work in an iframe.
//     // You won't need it on your project.
//     container: PropTypes.object,
//     theme: PropTypes.object.isRequired,
// };

// export default withStyles(styles, { withTheme: true })(LeftPanelLayout);

LeftPanelLayout.propTypes = {
    classes: PropTypes.object.isRequired,
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,

};
export default withStyles(styles, { withTheme: true })(LeftPanelLayout);