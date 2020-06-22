import React, { Component } from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup } from 'reactstrap';
import { AvForm, AvField, AvRadioGroup, AvRadio, AvCheckbox } from 'availity-reactstrap-validation';
import axios from 'axios';
import { CONFIG } from '../../Utils/config';
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
import { ReplyMessage } from '../Shared/ReplyMessage';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import c_msg from './../../Assets/Img/mail.png';
import arrow from './../../Assets/Img/arrow-msg.png';

import './Notifications.css';


const actionsStyles = theme => ({
    tablepaggination: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing * 2.5,
    },
});

class Message extends React.Component {

    handleFirstPageButtonClick = event => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = event => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = event => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = event => {
        this.props.onChangePage(
            event,
            Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
        );
    };


    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
            <div className={classes.tablepaggination}>
                <IconButton
                    onClick={this.handleFirstPageButtonClick}
                    disabled={page === 0}
                    aria-label="First Page"
                >
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton
                    onClick={this.handleBackButtonClick}
                    disabled={page === 0}
                    aria-label="Previous Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }
}

const MessageWrapped = withStyles(actionsStyles, { withTheme: true })(
    Message,
);


export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userId: parseInt(this.props.match.params.id),
            readData: [],
            unreadData: [],
            pageCount: 0,
            name: localStorage.getItem('name'),
            addModal: false,
            message: [],
            mailContent: '',
            replyMes: false,
            messageData: [],
            isRead: false,
            addMessageModal: false,
            composeMessage: '',
            composeError: false

        };
        this.handleChangeContent = this.handleChangeContent.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
    }
    handleChangeContent(e) {
        let mailContent = e.target.value;
        this.setState({
            mailContent
        })
    }

    sendMessage() {
        if (this.state.composeMessage == '') {
            this.setState({ composeError: true })
        }
        else {
            this.setState({ isLoading: true })
            let token = localStorage.getItem('accessKey');
            if (token) {
                axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
            }
            const data = {
                'MailContent': this.state.composeMessage
            }
            axios.post(CONFIG.API_URL + 'home/composemail/',data)
                .then(res => {
                    this.setState({ isLoading: false, composeError: false })
                    alert('Mail has been sent.');
                    this.toggleClose();
                    //this.initializeUserMessageParams()

                })

                .catch((err) => {
                    this.setState({
                        isLoading:false,
                        composeError:true
                    })
                    alert('Something went wrong.Please try again');
                    this.toggleClose();
                })
        }
    }


    handleChangeDescription(e) {
        let propertyDescription = e.target.value;
        this.setState({
            propertyDescription,composeError:false
        })
    }

    readMessage(data) {
        let messageData = data;
        this.setState({ isRead: true, replyMes: true, messageData: messageData });
        // let message = data;
        // this.setState(state => ({ addModal: !state.addModal, message: message }))
    }


    handleChangeMessage(e) {
        let composeMessage = e.target.value;
        this.setState({
            composeMessage, composeError: false
        })
    }
    unreadMessage(data) {
        debugger;
        let messageData = data;
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'home/readmessage/' + data.ID)
            .then(res => {
                let message = data;
                this.getMessages();
                this.setState(state => ({ addModal: !state.addModal, message: message, messageData: messageData, isRead: false, replyMes: true }))
            })
            .catch((err) => {
                console.log(err);
            })
    }
    replyMessage(message) {
        this.setState({ replyMes: true });
    }

    toggleClose = () => this.setState(state => ({ addModal: false, mailContent: '', addMessageModal: false }))

    nextMessage(message) {

    }
    getMessages() {
        let userId = this.state.userId;
        let token = localStorage.getItem('accessKey');
        if (token) {
            axios.defaults.headers.common["Authorization"] = 'Bearer ' + token;
        }
        axios.get(CONFIG.API_URL + 'home/messages')
            .then(res => {
                let readData = res.data.readMessage;
                let unreadData = res.data.unreadMessages;
                this.setState({ readData: readData, unreadData: unreadData });
            })
            .catch((err) => {
                alert('Something went wrong.Please try again!')
            })
    }

    addtoggleCommunicationModal() {

        this.setState(state => ({ addMessageModal: !state.addMessageModal,composeMessage:'' }))

    }


    componentDidMount() {
        this.getMessages();
    }
    handleChangePageTrack = (event, pageCount) => {
        this.setState({ pageCount });
    };

    handleChangeRowsPerPageTrack = event => {
        this.setState({ pageCount: 0, 10: event.target.value });
    };



    render() {
        document.title = CONFIG.PAGE_TITLE + 'Notifications';
        const { isLoading, readData, unreadData, name, pageCount, message, composeError,messageData, composeMessage, mailContent, replyMes, isRead } = this.state;

        return (
            <main className="dashboard-layout-height">
                {isLoading ? <div className="loader-wrap"><div className="page-loading"></div></div> : ''}
                <div className="notification-dash">
                    <Row className="notofication-dash-head">
                        <Col md={10}>
                            <div className="heading">
                                <h5>Notifications</h5>
                                {/* <div><span className="heading-broder"></span></div> */}
                            </div>
                        </Col>
                        <Col md={2}>
                            <div className="compose-message-link">
                            <Link onClick={this.addtoggleCommunicationModal.bind(this)} ><img src={c_msg} className="icon-size" alt="" /> Compose Message</Link>
                            </div>
                        </Col>
                    </Row>
                   
                    <div className=" leftandright-nomargin">
                        <Row className="document-list-seller">

                            <Col md={12} className="paddingremove-colm">

                                <div className="table-seller-property">
                                    <Table className="table custom-table table-bordered store-count-popup">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>S.No</TableCell> */}
                                                <TableCell>Unread Notifications</TableCell>
                                                {/* <TableCell>Action</TableCell> */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody className="unread-notification-box">
                                            {unreadData.length !== 0 ? unreadData.slice(pageCount * 10, pageCount * 10 + 10).map((data) =>
                                                <TableRow key={data.ID}>
                                                    {/* <TableCell>{document.DocumentTypeID}</TableCell> */}
                                                    <TableCell>{name} - <span className="color-span">{moment(data.CreatedDate).format("L")}</span>
                                                        {data.MailSubject} : {data.MailContent}.... <Link to="#" className="readmore-right" onClick={this.unreadMessage.bind(this, data)}>Read more information</Link>
                                                    </TableCell>
                                                    {/* <TableCell><Button className="view-btn" onClick={this.download.bind(this, document.FileName)}>view</Button></TableCell> */}

                                                </TableRow>
                                            ) :
                                                <TableRow className="notification-no-found">No notification found</TableRow>
                                            }
                                        </TableBody>
                                        {unreadData.length !== 0 ?
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[1]}
                                                        colSpan={3}
                                                        count={unreadData ? unreadData.length : 0}
                                                        rowsPerPage={10}
                                                        page={pageCount}
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                        onChangePage={this.handleChangePageTrack}
                                                        onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                        ActionsComponent={MessageWrapped}
                                                    />
                                                </TableRow>
                                            </TableFooter> : ''}

                                    </Table>
                                </div>
                            </Col>
                        </Row>

                        <Row className="document-list-seller">
                            <Col md={12} className="paddingremove-colm">

                                <div className="table-seller-property">
                                    <Table className="table custom-table table-bordered store-count-popup">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell>S.No</TableCell> */}
                                                <TableCell>Read Notifications</TableCell>
                                                {/* <TableCell>Action</TableCell> */}
                                            </TableRow>
                                        </TableHead>

                                        <TableBody className="read-notification-box">
                                            {readData.length !== 0 ? readData.slice(pageCount * 10, pageCount * 10 + 10).map((data) =>
                                                <TableRow key={data.ID}>
                                                    {/* <TableCell>{document.DocumentTypeID}</TableCell> */}
                                                    <TableCell>{name} - <span className="color-span">{moment(data.CreatedDate).format("L")}</span>
                                                        {data.MailSubject} : {data.MailContent}.... <Link to="#" className="readmore-right" onClick={this.readMessage.bind(this, data)}>Read more information</Link>
                                                    </TableCell>
                                                    {/* <TableCell><Button className="view-btn" onClick={this.download.bind(this, document.FileName)}>view</Button></TableCell> */}

                                                </TableRow>
                                            ) :
                                                <TableRow className="notification-no-found">No notification found</TableRow>
                                            }
                                        </TableBody>
                                        {readData.length !== 0 ?
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[1]}
                                                        colSpan={3}
                                                        count={readData ? readData.length : 0}
                                                        rowsPerPage={10}
                                                        page={pageCount}
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                        onChangePage={this.handleChangePageTrack}
                                                        onChangeRowsPerPage={this.handleChangeRowsPerPageTrack}
                                                        ActionsComponent={MessageWrapped}
                                                    />
                                                </TableRow>
                                            </TableFooter> : ''
                                        }

                                    </Table>
                                </div>
                            </Col>
                        </Row>
                        <div>{replyMes === true ? <ReplyMessage params={messageData} isRead={isRead}></ReplyMessage> : ''}</div>
                       
                        <div>
                            <Modal size="md" isOpen={this.state.addMessageModal} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new edit-market-dashboard">
                                <ModalHeader toggle={this.toggleClose.bind(this)}>Compose Message
                        </ModalHeader>
                                <ModalBody className="overflow-scroll basic-details">
                                    <Row>
                                        <Col md={12}>
                                            <Label>Description</Label>
                                            <Input type="textarea" className="description-box-height" name="Message" value={composeMessage} onChange={this.handleChangeMessage.bind(this)} />
                                            {composeError == true ? <p className="error">Please enter description</p> : ''}
                                        </Col>

                                    </Row>

                                    <Row className="save-right margin-top-buyer">
                                        <Col md={12}>
                                            <Button className="" onClick={this.sendMessage.bind(this)}>Send Message</Button>
                                        </Col>
                                    </Row>
                                </ModalBody>
                            </Modal>

                        </div>

                    </div>
                </div>
            </main>
        )

    }
}
