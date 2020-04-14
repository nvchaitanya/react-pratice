import React from 'react'
class Add extends React.Component{
    constructor(props){
        super(props)
        this.state={
            itemname:''
        }
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleClick=()=>{
        if(this.state.itemname===""){
            alert('Please Fill the input Value!')
        }
        else{
            this.props.parentFunc(this.state.itemname)
            this.reset()
        }
    }
    reset=()=>{
        this.setState({
            itemname:""
        })
    }
    render(){
        return(
            <div className="container">
                <h1 className="text-center">ToDo App</h1>
                <div className="col-12 col-md-8 col-lg-6 offset-lg-3 d-flex my-3 shadow-lg py-5"> 
                    <input type="text" name="itemname" onChange={this.handleChange} value={this.state.itemname} className="form-control mr-2" placeholder="Enter Todo Task"/>
                    <button className="btn btn-primary" onClick={this.handleClick}>ADD</button>
                </div>
            </div>
        )
    }
}
export default Add