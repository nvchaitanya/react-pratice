import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Link } from "react-router-dom";
import { CONFIG } from '../../../../Utils/config';
import axios from 'axios';
import './MarketReport.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment';

export default class MarketReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      

    };
  }

  componentDidMount() {
    
  }

  getProperty() {
   
  }

  

  render() {
    document.title = CONFIG.PAGE_TITLE + 'Market Report';
    const { isLoading } = this.state;
    
    return (
      <main className="dashboard-layout-height ">
      {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
      <div>
        
      </div>
      </main>
    );
  }
}
