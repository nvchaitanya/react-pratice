import React from 'react';
import { Button, Row, Container, Col, Modal, ModalHeader, ModalFooter, ModalBody, FormGroup, Table } from 'reactstrap';
import { getFormattedInt } from '../../../../../Utils/utils';
import './DealViewModal.css';
import moment from 'moment';

export default class DealViewModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            deal: {},
        }
    }
    componentDidMount() {
    }

    getDeal(deal) {
        this.setState({ isOpen: true, deal });
    }

    toggleClose() {
        this.setState({ isOpen: false });
    }

    render() {
        const { isOpen, deal } = this.state;
        return (
            <div>
                <Modal size="md" isOpen={isOpen} toggle={this.toggleClose.bind(this)} backdrop="static" className="create-new deal-view-modal edit-market-dashboard">
                    <ModalHeader toggle={this.toggleClose.bind(this)}>{deal.DealName}
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <Table className="table-dealviewmodal">
                                    <tr>
                                        <td>LOI Name</td>
                                        <td>:</td>
                                        <td><span>{deal.LOIName}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Company Name</td>
                                        <td>:</td>
                                        <td><span>{deal.LOICompanyName}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Diligence Period</td>
                                        <td>:</td>
                                        <td><span>{deal.DiligencePeriod}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Earnest Money Deposit</td>
                                        <td>:</td>
                                        <td><span>${getFormattedInt(deal.EarnestMoneyDeposit)}</span></td>
                                    </tr>
                                </Table>
                                {/* <p>LOI Name:{deal.LOIName}</p>
                            
                                <p>Company Name:{deal.LOICompanyName}</p>
                           
                                <p>Diligence Period:{deal.DiligencePeriod}</p>
                           
                                <p>Earnest Money Deposit:${getFormattedInt(deal.EarnestMoneyDeposit)}</p> */}
                            </Col>
                            <Col md={6}>
                                <Table className="table-dealviewmodal">
                                    <tr>
                                        <td>Source Of Financing</td>
                                        <td>:</td>
                                        <td><span>{deal.SourceOfFinancing}</span></td>
                                    </tr>
                                    <tr>
                                        <td>NDA Name</td>
                                        <td>:</td>
                                        <td><span>{deal.NDAName}</span></td>
                                    </tr>
                                    <tr>
                                        <td>NDA Company Name</td>
                                        <td>:</td>
                                        <td><span>{deal.NDACompanyName}</span></td>
                                    </tr>
                                    <tr>
                                        <td>NDASignedDate</td>
                                        <td>:</td>
                                        <td><span>{moment(deal.NDASignedDate).format("L")}</span></td>
                                    </tr>
                                </Table>
                                {/* <p>Source Of Financing:{deal.SourceOfFinancing}</p>
                           
                                <p>NDA Name:{deal.NDAName}</p>
                           
                                <p>NDA Company Name:{deal.NDACompanyName}</p>
                           
                                <p>NDASignedDate:{moment(deal.NDASignedDate).format("L")}</p> */}
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}