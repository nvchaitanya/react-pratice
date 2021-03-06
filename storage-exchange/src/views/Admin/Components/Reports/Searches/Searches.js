import React, { Component } from 'react';
import { CONFIG } from '../../../../../Utils/config';
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import classnames from 'classnames';
import './Searches.css';
import { Button, Label, Row, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';
// import BarChart from 'recharts.recharts.bar-chart';
// import Bar from 'recharts.recharts.bar';
import { Container } from '@material-ui/core';
import { LineChart, Line,Bar,BarChart,Legend,AreaChart,CartesianGrid,XAxis,YAxis,Tooltip,Area } from 'recharts';


export default class Searches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      rangeID: 0,
      dateRangeData: [],
      fromDate: '',
      toDate: '',
      recordData: [],
      sampleData : [
        {
          name: 'Page A', uv: 4000
        },
        {
          name: 'Page B', uv: 3000
        },
        {
          name: 'Page C', uv: 2000, 
        },
        {
          name: 'Page D', uv: 2780
        },
        {
          name: 'Page E', uv: 1890
        },
        {
          name: 'Page F', uv: 2390
        },
        {
          name: 'Page G', uv: 3490
        },
      ]
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.handleFromDate = this.handleFromDate.bind(this);
    this.handleToDate = this.handleToDate.bind(this);
  }


  handleFromDate(date) {
    debugger;
   let fromDate = moment(date).format('L');
   
   
     if (fromDate.length < 11) {
         this.setState({
             fromDate: date
         });
     }

 }



  handleToDate(date) {
    debugger;
    let toDate = moment(date).format('L');
    if (toDate.length < 11) {
      this.setState({
        toDate: date
      });
    }
  }




  resetForm(event) {
    this.form.reset();
  }

  handleSubmit(event, errors, values) {
    debugger;
    if (errors.length === 0) {
      this.setState({ isLoading: true });
      
      const data = {
        'rangeId': parseInt(values.range),
        'startDate': this.state.fromDate,
        'endDate': this.state.toDate
      }
      this.getReport(data);

    }
  }

  getReport(param) {
    debugger;
    if(param.startDate != "")
      {
        param.rangeId = '';
      }
    const data = {
      'DateRangeID': param.rangeId,
      'StartDate': param.startDate !== '' ? moment(param.startDate).format('YYYY-MM-DD') :'',
      'EndDate': param.endDate !== '' ? moment(param.endDate).format('YYYY-MM-DD') :''
    }

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.post(CONFIG.API_URL + 'analysis/report/search/', data)
      .then(response => {
        if (response.status === 200) {
          //when email changed need to update token
          let test = this.state.sampleData;
          let recordData = response.data.report;
          this.setState({ isLoading: false, recordData: recordData });
        }
      })
      .catch(err => {
        this.setState({ isLoading: false });
        if (err.response != null && err.response.status === 400) {
          const error = err.response.data;
          // this.setState({ error, success: '' });
          alert({error})
        }
        else {
          const error = "Something went wrong.";
          // this.setState({ error });
          alert({error})
        }

      });

  }






  getLookupValues() {

    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    axios.get(CONFIG.API_URL + 'lookup/daterange')
      .then(res => {
        let dateRangeData = res.data.daterange;
        this.setState({ dateRangeData })

      })
      .catch((err) => {
        console.log(err);
      })


  }

  componentDidMount() {
    debugger;
    this.getLookupValues();
    const data = {
      'rangeId': 1,
      'startDate': '',
      'endDate': ''
    }
    this.getReport(data);
  }



  render() {
    document.title = CONFIG.PAGE_TITLE + 'Analytics - Searches';
    const { isLoading, dateRangeData, rangeID, fromDate,sampleData ,toDate,recordData } = this.state;

    return (
      <main className="">
        {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
        <div className="admin-dash-details">

          <AvForm onSubmit={this.handleSubmit.bind(this)} onReset={this.resetForm.bind(this)} ref={c => (this.form = c)}>
          <Row className="form-analytics-fields form-back-shadow">
         
           <Col md={3}>
              <AvField type="select" name="range" value={rangeID}
                label="Date Range"
              // validate={{
              //   required: { value: true, errorMessage: 'State is required' },
              // }}
              >
                {/* <option value={}>--Select--</option> */}
                {dateRangeData ? dateRangeData.map(n => {
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
              <Label>From Date</Label>
              <DatePicker className="is-touched is-pristine av-valid form-control" selected={fromDate} onChange={this.handleFromDate} />
             </Col>
             <Col md={3}>
              <Label>To Date</Label>
              <DatePicker className="is-touched is-pristine av-valid form-control" selected={toDate} onChange={this.handleToDate} />
            </Col>
            <Col md={3} className="btn-submit-search">
               <Button className="button-11s" type="submit">Submit</Button>
              <Button className="btn-reset" type="reset">Clear</Button>
              </Col>
            </Row>
          </AvForm>
        {/* <BarChart width={150} height={40} data={sampleData}>
		<Bar dataKey="uv" fill="#8884d8" />
	</BarChart>  */}
  <Col md={12} className="text-align-left remove-padd-search search-graph">
	<BarChart
				width={1040}
        height={300}
        barSize={50}
				data={recordData}
				margin={{
					top: 20, right: 0, left: -35, bottom: 0,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="SearchKeyword" />
				<YAxis dataKey="Count"/>
				<Tooltip />
				<Legend />
				<Bar dataKey="Count" stackId="a" fill="#8884d8" />
			
			</BarChart>
      </Col>

{/* <LineChart
					width={500}
					height={200}
					data={recordData}
					syncId="anyId"
					margin={{
						top: 10, right: 30, left: 0, bottom: 0,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="Date" />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey="Count" stroke="#8884d8" fill="#8884d8" />
				</LineChart>
				<p>Maybe some other content</p> */}
				{/* <LineChart
					width={500}
					height={200}
					data={data}
					syncId="anyId"
					margin={{
						top: 10, right: 30, left: 0, bottom: 0,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
					<Brush />
				</LineChart> */}
			

        </div>
      </main>
    );
  }
}
