import React from 'react'

class CardPayment extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            cardType:'',
            cardNumber:'',
            otp:''
        }
    }
    
    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleClick = () => {
        let {cardType,cardNumber,otp} = this.state
        if(cardType==='' || cardNumber==='' || otp==='') alert('Please fill all the details / proper details !')
        else this.props.history.push('/orderPlaced')
    }
    render(){
        return(
            <div className='container my-5'>
                <h2 className='mb-3'>Payment</h2>
                <div>
                    <label >Card Type </label>
                    <select name="cardType" value={this.state.cardType} onChange={this.handleChange} className='form-control mb-3'>
                        <option value=""> -- Select Card Type --</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>
                <div>
                    <label>Card Number</label>
                    <input type="number" name='cardNumber' value={this.state.cardNumber} onChange={this.handleChange} className='form-control mb-3'/>
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
export default CardPayment