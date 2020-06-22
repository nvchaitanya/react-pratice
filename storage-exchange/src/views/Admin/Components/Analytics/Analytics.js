import React, { Component } from 'react';
import { CONFIG } from '../../../../Utils/config';
import { Link } from "react-router-dom";
import { Searches } from '../Reports';
import { UserSession } from '../Reports';
import { PropertyReport } from '../Reports';
import { MostView } from '../Reports';
import { Buyer } from '../Buyer';
import { AdminView } from '../AdminView'
import classnames from 'classnames';
import './Analytics.css';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { Container } from '@material-ui/core';

export default class Analytics extends Component {
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
debugger;
    const { from } = { from: { pathname: "/admin/analytics/" + tab } };
    this.props.history.push(from)
    this.toggle(tab);
  }

  componentDidMount() {
    debugger;
    let tabId = this.props.match.params.tabId;
    this.tabSection(tabId);
  }


  // componentWillReceiveProps(nextnprops) {

  //   let tabId = nextnprops;
  //   let id = tabId.match.params.tabId
  //   this.toggle(id);
  // }


  render() {
    document.title = CONFIG.PAGE_TITLE + 'Admin Dashboard';
    const { activeTab } = this.state;
    return (
      <main className="dashboard-layout-height">
        <div className="background-clr-admin">
          <Container className="dashboard-analytics">
            <div className="heading">
              <h5>Analytics</h5>
              {/* <div><span className="heading-broder"></span></div> */}
            </div>
            <div className="back-shadow-box">
              <Nav tabs className="dashboard-tabs">
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.tabSection('1'); }}
                  >
                    Search
                </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.tabSection('2'); }}
                  >
                    User Session
                </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.tabSection('3'); }}
                  >
                    Most View
                </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.tabSection('4'); }}
                  >
                   Property Report
                </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab} className="dash-board-back">
                <TabPane tabId="1">
                  <Row>
                    <Col md="12" >
                      {activeTab === '1' ? <Searches params={this.props}></Searches> : ''}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col md="12">
                      {activeTab === '2' ? <UserSession params={this.props}></UserSession> : ''}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3">
                  <Row>
                    <Col md="12" className="detailed-tab">
                      {activeTab === '3' ? <MostView params={this.props}></MostView> : ''}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col md="12" className="detailed-tab">
                      {activeTab === '4' ? <PropertyReport params={this.props}></PropertyReport> : ''}
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
