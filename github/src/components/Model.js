import React from 'react'
import {Button, Modal} from 'react-bootstrap'
class Model extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isShow:false
        }
    }
    handleClick=()=>{
        this.setState({
            isShow:!this.state.isShow
        })
    }
    render(){
        return(
            <div>
                <Button onClick={this.handleClick}>Display Profile</Button>
                <Modal show={this.state.isShow} onHide={this.handleClick} >
                    <Modal.Header closeButton>
                        <h2 className="text-center">{this.props.nameLabel} : {this.props.name}</h2>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <img src={this.props.pic} alt="..." height='420' width='100%'/>
                            <h4 className="mt-2">ID: {this.props.id}</h4>
                            <h4>{this.props.label} : {this.props.score}</h4>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.handleClick} className="mr-auto">Close Modal</Button>
                        <Button onClick={this.handleClick} className="bg-dark">Hide Model</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
export default Model