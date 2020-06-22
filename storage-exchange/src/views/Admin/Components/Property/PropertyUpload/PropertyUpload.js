import React, { Component } from 'react';
import './PropertyUpload.css';
import { Button, Form, FormGroup, Input, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { CONFIG } from '../../../../../Utils/config';
import { getToken } from '../../../../../Utils/localStorage';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

class PropertyUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showUpload: false,
            isLoading: false,
            file: '', imagePreviewUrl: '',
            storeId: props.storeId,
            documentTypeId: props.documentId,
            errors: {},
            token: '',
        };
    }

    showPopup = (isshow) => {
        this.setState({ showUpload: isshow });
    }

    componentDidMount() {
        let token = getToken();
        this.setState({ token });
    }

    processHandler = (fieldName, file, metadata, load, error, progress, abort, template) => {

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('StoreID', this.state.storeId);
        formData.append('DocumentTypeID', this.state.documentTypeId);

        const request = new XMLHttpRequest();
        let token = localStorage.getItem('accessKey');
        let reqUrl = this.state.documentTypeId > 0 ? 'admin/upload/document' : 'admin/upload/image';
        request.open('POST', CONFIG.API_URL + reqUrl);

        request.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
        };

        request.onload = (e) => {
            if (request.status == 200) {
                load("success");
                this.props.parentMethod();
                this.setState({ showUpload: false });
            }
            else {
                error('oh no');
            }
        };

        request.setRequestHeader('Authorization', 'Bearer ' + token);
        request.send(formData);
        //Should expose an abort method so the request can be cancelled
        return {
            abort: () => {
                // This function is entered if the user has tapped the cancel button
                request.abort();

                // Let FilePond know the request has been cancelled
                abort();
            }
        };
    }


    render() {
        const { showUpload, storeId, documentTypeId, token } = this.state;
        return (
            <div className="showUpload">
                <Button onClick={() => this.showPopup(true)}>{documentTypeId > 0 ? 'Upload' : '[+] Add New Image'}</Button>
                <Dialog
                    open={showUpload}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <div className="dialog-box-image-upload">
                        <DialogTitle id="alert-dialog-title" className="title-popup">
                            Upload {documentTypeId > 0 ? 'Document' : 'Image'}
                            <button onClick={() => this.showPopup(false)}>X</button>
                        </DialogTitle>
                    </div>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="previewComponent">
                                <FilePond ref={ref => this.pond = ref}
                                    allowMultiple={false}
                                    allowFileTypeValidation={true}
                                    allowImagePreview={false}
                                    allowFileSizeValidation={true}
                                    maxFileSize='1MB'
                                    maxTotalFileSize='1MB'
                                    labelMaxFileSizeExceeded='File is too large'
                                    labelMaxFileSize='Maximum file size is 1MB'
                                    //acceptedFileTypes={['file/xls', 'file/xl', 'file/xlsl']}
                                    labelIdle={documentTypeId > 0 ? "Drag & Drop your Document OR Browse" : "Drag & Drop your Image OR Browse"}
                                    //accept="*"
                                    maxFiles={1}
                                    server={{
                                        url: './',
                                        process: this.processHandler
                                    }}
                                >
                                </FilePond>
                                <div className="clear"></div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div >
        );
    }
}


export default PropertyUpload;