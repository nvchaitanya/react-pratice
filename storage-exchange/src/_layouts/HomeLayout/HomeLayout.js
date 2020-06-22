import React, { Component } from 'react';
import { Header, Footer } from '../../Core';
import './HomeLayout.css';

class HomeLayout extends Component {
   
    render() {
        return (
            <div className="home-page">

                <Header parm={this.props} />
                
                {this.props.children}
                
                <Footer />

            </div>
        );
    }
}

export default HomeLayout;  