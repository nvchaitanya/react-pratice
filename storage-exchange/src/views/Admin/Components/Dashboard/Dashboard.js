import React, { Component } from 'react';
import { CONFIG } from '../../../../Utils/config';
import { Link } from "react-router-dom";
import { Seller } from '../Seller';
import { Buyer } from '../Buyer';
import { AdminView } from '../AdminView'
import classnames from 'classnames';
import './Dashboard.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { Container } from '@material-ui/core';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {

    let test = this.props;
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }

  }

  tabSection(tab) {
    if (tab == 1) {
      document.getElementById("divbuyer").click();
    } else if (tab == 2) {
      document.getElementById("divseller").click();
    } else {
      document.getElementById("divadmin").click();
    }

    const { from } = { from: { pathname: "/admin/dashboard/" + tab } };
    this.props.history.push(from)
  }

  componentDidMount() {

    let tabId = this.props.match.params.tabId;
    this.toggle(tabId);
  }

  //   async UNSAFE_componentWillMount() {
  //     console.log(this.props)
  //     
  //     // let tabId = nextnprops;
  //     // let id = tabId.match.params.tabId
  //     // this.toggle(id);
  // }
  componentWillReceiveProps(nextnprops) {

    let tabId = nextnprops;
    let id = tabId.match.params.tabId
    this.toggle(id);
  }


  render() {
    document.title = CONFIG.PAGE_TITLE + 'Admin Dashboard';
    const { activeTab } = this.state;
    return (
      <main className="dashboard-layout-height">
        <div className="background-clr-admin">
          <Container className="dashboard-admin">
            <div className="heading">
              <h5>User Management</h5>
              {/* <div><span className="heading-broder"></span></div> */}
            </div>
            <div className="back-shadow-box">
              <Nav tabs className="dashboard-tabs">
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.tabSection('1'); }}
                  >
                    Buyer
                </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.tabSection('2'); }}
                  >
                    Seller
                </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.tabSection('3'); }}
                  >
                    Admin
                </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab} className="dash-board-back">
                <TabPane tabId="1">
                  <Row>
                    <Col md="12" >
                      {activeTab === '1' ? <Buyer params={this.props}></Buyer> : ''}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col md="12">
                      {activeTab === '2' ? <Seller params={this.props}></Seller> : ''}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col md="12" className="detailed-tab">
                      {activeTab === '3' ? <AdminView params={this.props}></AdminView> : ''}
                    </Col>
                  </Row>
                </TabPane>

              </TabContent>
            </div>
          </Container>
        </div>
      </main>
    );
  }
}
