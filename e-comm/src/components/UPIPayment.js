import React from 'react'

class UPIPayment extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            upiId:'',
            otp:''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleClick = () => {
        const {upiId,otp} = this.state
        if(upiId === ''|| otp === '') alert('Please fill all the details / proper details !')
        else this.props.history.push('/orderPlaced')
    }

    render(){
        return(
            <div className='container my-5'>
                <h2 className='mb-3'>Payment</h2>
                <div>
                    <label>UPI ID</label>
                    <input type="text" name='upiId' value={this.state.upiId} onChange={this.handleChange} className='form-control mb-3'/>
                </div>
                <div>
                    <label>OTP</label>
                    <input type="number" name='otp' value={this.state.otp} onChange={this.handleChange} className='form-control mb-3'/>
                </div>
                <button className='btn btn-danger px-5' onClick={this.handleClick}>Pay</button>
            </div>
        )
    }
}
export default UPIPayment