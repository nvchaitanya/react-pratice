import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { HomeLayout, LeftPanelLayout } from '../_layouts';

const authGuard = {
    authenticate() {
        let token = localStorage.getItem('accessKey');
        if (token) {
            return true;
        } else {
            return false
        }
    },
    isNotAdmin() {
        let isauthenticated = this.authenticate();
        let role = localStorage.getItem('role');

        if (isauthenticated && role == "Admin") {
            return false;
        }
        return true;
    }

};

export const HomeLayoutRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={matchProps => (
            // authGuard.isNotAdmin() ? (
            //     <HomeLayout>
            //         <Component {...matchProps} />
            //     </HomeLayout>
            // ) :
            //     <Redirect
            //         to={{
            //             pathname: "/admin/dashboard/1/",
            //         }}
            //     />

            <HomeLayout>
                <Component {...matchProps} />
            </HomeLayout>
        )} />
    )
};

export const LeftPanelLayoutRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={matchProps => (
            authGuard.authenticate() ? (
                <LeftPanelLayout>
                    <Component {...matchProps} />
                </LeftPanelLayout>
            ) :
                <Redirect
                    to={{
                        pathname: "/signin",
                    }}
                />
        )} />
    )
};
