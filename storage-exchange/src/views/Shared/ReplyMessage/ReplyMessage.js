import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup, NavbarText } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../../Utils/config';
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import { Label, Input } from 'reactstrap';
import moment from 'moment';
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
//import msg from './../../Assets/Img/msg-icon.png';
import msg from '../../../Assets/Img/msg-icon.png'
import arrow from '../../../Assets/Img/arrow-msg.png';

import './ReplyMessage.css';

export default class ReplyMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      readData: [],
      unreadData: [],
      pageCount: 0,
      name: localStorage.getItem('name'),
      addModal: false,
      message: [],
      mailDes: '',
      desAlert: false,
      isRead: false,
      allMes: [],
      isShow: true

    };
    this.handleChangeContent = this.handleChangeContent.bind(this);
  }
  handleChangeContent(e) {
    let mailDes = e.target.value;
    this.setState({
      mailDes, desAlert: false
    })
  }

  nextMessage(data) {
    let userId = parseInt(localStorage.getItem('id'));
    let token = localStorage.getItem('accessKey');
    if (token) {
      axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
    }
    if (this.state.isRead === undefined) {
      let readDa = this.state.allMes.Messages;
      var count;
      var i = readDa.forEach(function (x, index) {
        if (x.ID === data.ID) {
          count = index;
        }
      })
      let message = readDa[count + 1];
      if (message === undefined) {
        alert('All notification has been read.')
      }
      else {
        this.state.message = [];
        this.setState({ message: message });
      }
    }
    else {

      axios.get(CONFIG.API_URL + 'home/messages')
        .then(res => {
          let readData;
          if (this.state.isRead === true) {
            readData = res.data.readMessage;
          }
          else {
            readData = res.data.unreadMessages
          }

          var count;
          var i = readData.forEach(function (x, index) {
            if (x.ID === data.ID) {
              count = index;
            }
          })
          let message = readData[count + 1];
          if (message === undefined) {
            alert('All notification has been read.')
          }
          else {
            this.setState({ message: message });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  replyMessage(message) {
    if (this.state.mailDes === '') {
      this.setState({ desAlert: true })
    }
    else {
      let token = localStorage.getItem('accessKey');
      if (token) {
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;

      }
      const data = {
        'ID': message.ID,
        'MailSubject': message.MailSubject,
        'MailContent': this.state.mailDes,
        'FromUserID': message.FromUserID,
        'ToUserID': message.ToUserID,
        'ParentMessageID': message.ParentMessageID,
        'StoreID': message.StoreID
      }
      axios.post(CONFIG.API_URL + 'home/replymail/', data)
        .then(res => {
          this.toggleClose();
          this.setState({ desAlert: false, mailDes: '' });
          window.location.reload();

        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
  toggleClose() {
    window.location.reload();
    this.setState({ addModal: false, mailDes: '' });
    
  }

  componentWillReceiveProps(nextprops) {
    this.state.message = [];
    let message = this.props.params;
    let isRead = this.props.isRead;
    let isShow = isRead === undefined ? false : true
    let allMes = this.props.allmessage;
    this.setState({ addModal: true, message: message, isRead: isRead, allMes: allMes, isShow:isShow })
  }

 // toggleClose = () => this.setState(state => ({ mailContent: '', message: [], addModal: false, }))
  componentDidMount() {
    this.state.message = [];
    let message = this.props.params;
    let isRead = this.props.isRead;
    let isShow = isRead === undefined ? false : true
    let allMes = this.props.allmessage;
    this.setState({ addModal: true, message: message, isRead: isRead, allMes: allMes, isShow })
  }
  render() {
    const { isLoading, signinError, name, message, mailDes, desAlert,isShow } = this.state;

    return (
      <div >
        <div>

          <Modal size="md" isOpen={this.state.addModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
            <ModalHeader className="notification-popup" toggle={this.toggleClose.bind(this)}><img src={msg} alt="" /> Read more information
    </ModalHeader>
            <ModalBody className="overflow-scroll basic-details notification-body">
              <Row>
                <Col sm={8} className="table-no-border padding-remove-left">
                  <table>
                    <tr>
                      <td><b>From:</b></td>
                      <td><span className="name-user-msg">{name}</span>
                      <br/><p><span className="date-formate">{moment(message.CreatedDate).format("L")}</span> - {moment(message.CreatedDate).format("h:mm a")}</p>
                      </td>
                    </tr>
                  </table>
                </Col>
                <Col sm={4}>
              {isShow === true ? <Link onClick={this.nextMessage.bind(this, message)}>Read Next Message <img src={arrow} className="img-arrow-width" alt="next" title="next Message" /></Link> :''} 
                </Col>
                <br />
                <Col md={12}>
                  <p className="msg-head">Message:</p>
                  <p className="notification-content">{message.MailContent}</p>
                </Col>
                <Col md={12}>
                  <Input type="textarea" className="description-box-height" placeholder="Reply:" name="Reply" value={mailDes ? mailDes : ''} onChange={this.handleChangeContent.bind(this)} />
                  {desAlert === true ? <p className="error">Please enter description</p> : ''}

                </Col>
              </Row>

              <Row >
                <Col md={12} className="notification-top save-right">
                  <Button className="submit-msg-btn" onClick={this.replyMessage.bind(this, message)}>Submit</Button>
                  <Button className="cancle-btn-msg" onClick={this.toggleClose.bind(this)}>Cancel</Button>
                </Col>
              </Row>

            </ModalBody>
          </Modal>

        </div>
      </div>
    );
  }
}
