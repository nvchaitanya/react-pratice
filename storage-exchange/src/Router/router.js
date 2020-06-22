import React, { Component } from 'react';
import { BrowserRouter, Switch, Route ,Router} from 'react-router-dom';
import {
    AdminSignin, Home, Signin, NotFound, Dashboard, PropertySearch, PropertyView, Category, VendorSearch, DealTracker, BuyerView, SellerView, PropertyDetail, ResetPassword,Analytics,
    ProfileList, CategoryList, Notifications, ContactUs, BuyerRegistration, BuyerDashboard, SellerProperty, SellerDashboard, PropertyProfile, FilterProperty, ForgotPassword, MyAccount, Seller
} from '../views';

import { HomeLayoutRoute, LeftPanelLayoutRoute } from './routeLayout';
import history from '../history'

class RouteComp extends Component {
    render() {
        return (
            // <BrowserRouter>
            <Router history ={history} >
                <Switch>
                    <HomeLayoutRoute exact path="/" component={Home} />
                    <HomeLayoutRoute exact path="/property/search/:keyword" component={FilterProperty} />
                    <HomeLayoutRoute exact path="/property/search/" component={FilterProperty} />
                    <HomeLayoutRoute exact path="/property/:propertyId/:name/" component={PropertyView} />

                    <LeftPanelLayoutRoute path="/admin/dashboard/:tabId/" component={Dashboard} />
                    <LeftPanelLayoutRoute path="/viewbuyer/:buyerId/" component={BuyerView} />
                    <LeftPanelLayoutRoute path="/viewseller/:sellerId/" component={SellerView} />
                    <LeftPanelLayoutRoute path="/viewseller/:sellerId/" component={SellerView} />
                    <LeftPanelLayoutRoute path="/admin/properties" component={PropertySearch} />
                    <LeftPanelLayoutRoute path="/admin/property/:propertyId" component={PropertyDetail} />
                    <LeftPanelLayoutRoute path="/admin/category" component={Category} />
                    <LeftPanelLayoutRoute path="/admin/vendors" component={VendorSearch} />
                    <LeftPanelLayoutRoute path="/admin/dealtracker" component={DealTracker} />
                    <LeftPanelLayoutRoute path="/admin/analytics/:tabId" component={Analytics} />
                    <LeftPanelLayoutRoute path="/buyer/dashboard/" component={BuyerDashboard} />
                    <LeftPanelLayoutRoute path="/notification/:id" component={Notifications} />

                    <LeftPanelLayoutRoute path="/seller/dashboard/" component={SellerDashboard} />
                    <LeftPanelLayoutRoute path="/seller/property/:propertyId" component={SellerProperty} />


                    <LeftPanelLayoutRoute path="/buyer/property/:propertyId/" component={PropertyView} />
                    <HomeLayoutRoute path="/admin" component={AdminSignin} />
                    <HomeLayoutRoute path="/signin" component={Signin} />
                    <HomeLayoutRoute path="/resetpassword/:isForgotPassword/:PasswordResetToken" component={ResetPassword} />
                    <HomeLayoutRoute path="/forgotpassword/" component={ForgotPassword} />
                    <HomeLayoutRoute path="/profilelist/:parentCategoryID/:parentCategoryName/:childCategoryID/:childCategoryName" component={ProfileList} />
                    <HomeLayoutRoute path="/categorylist/:parentCategoryID" component={CategoryList} />
                    <HomeLayoutRoute path="/contactus" component={ContactUs} />
                    <HomeLayoutRoute path="/categorylist/" component={CategoryList} />
                    <HomeLayoutRoute path="/buyer-registration/:storeID/:StoreName" component={BuyerRegistration} />
                    <HomeLayoutRoute path="/buyer-registration/" component={BuyerRegistration} />
                    <LeftPanelLayoutRoute path="/my-account" component={MyAccount} />
                   
                    <HomeLayoutRoute path="*" component={Home} />
                </Switch>
            </Router>
            // </BrowserRouter>
        );
    }
}
export default RouteComp;