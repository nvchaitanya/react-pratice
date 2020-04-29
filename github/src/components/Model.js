import React from 'react'
import {Button, Modal} from 'react-bootstrap'
class Model extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isshow:false
        }
    }
    render(){
        return(
            <div>
                <Button>open Modal</Button>
                <Modal show={true}>
                    <Modal.Header>this is Header</Modal.Header>
                    <Modal.Body>This is body</Modal.Body>
                    <Modal.Footer>
                        <Button>
                            Close Modal
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
export default Model