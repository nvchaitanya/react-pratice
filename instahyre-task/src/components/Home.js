import React from 'react'
import Transactions from './Transactions'
import Capital from './Capital'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={
            istransaction:true,
            iscapital:false,
        }
    }
    handleTrans = () => {
        this.setState({
            istransaction:true,
            iscapital:false
        })
    }
    handleCapital = () => {
        this.setState({
            iscapital:true,
            istransaction:false
        })
    }
    render(){
        return(
            <div className='container my-3'>
                <input className='btn btn-outline-primary' 
                       onClick={this.handleTrans} 
                       value="Transactions"/>
                <input className='btn btn-outline-success mx-3' 
                       onClick={this.handleCapital} 
                       value="Capital"/>
                {this.state.istransaction && <Transactions />}
                {this.state.iscapital && <Capital />}
            </div>
        )
    }
}
export default Home