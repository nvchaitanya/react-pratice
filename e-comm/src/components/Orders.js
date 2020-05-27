import React from 'react'
import { connect } from 'react-redux'
import { totalOrdersPlaced } from '../Redux/Action'

export class Orders extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            address:'',
            mobile:'',
            payment:'...'
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleOrder = () => {
        if(this.state.name==='' || this.state.address==='' || this.state.mobile==='') alert('Please Fill all the Details!') 
        
        else{
            if(this.state.payment==='card'){
                this.props.history.push('/cardPayment')
            }
            else if(this.state.payment==='upi'){
                this.props.history.push('/upiPayment')
            }
            else{
                this.props.history.push('/orderPlaced')
            }
            this.props.totalOrdersPlaced(this.props.cartData)
        }
    }

    render(){
        return(
            <div className='container'>
                <div className='row'>
                    <div className='col-12 col-md-8 col-lg-7 my-3'>
                        <h3>Products in Cart</h3>
                        <div className='table-responsive'>
                            <table className='table border'>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.cartData.map(element => 
                                        <tr key={element.id}>
                                            <td>{element.title}</td>
                                            <td className='text-success'>{element.count}</td>
                                            <td className='text-primary font-weight-bold'>{element.count * element.price}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='col-12 col-md-8 col-lg-4 offset-lg-1 my-3'>
                        <h3>Fill Your Details</h3>
                        <div>
                            <label>Name</label>
                            <input type="text" name='name' value={this.state.name} onChange={this.handleChange} className='form-control mb-2'/>
                        </div>
                        <div>
                            <label>Address</label>
                            <textarea type="text" name='address' cols='10' rows='5' value={this.state.address} onChange={this.handleChange} className='form-control mb-3'/>
                        </div>
                        <div>
                            <label>Mobile</label>
                            <input type="number" name='mobile' value={this.state.mobile} onChange={this.handleChange} className='form-control mb-2'/>
                        </div>
                        <div>
                            <label>Payment Option</label>
                            <select name='payment' value={this.state.payment} onChange={this.handleChange} className='form-control mb-2'>
                                <option value="..."> -- Select Payment --</option>
                                <option value="card">Online Payments (Credit or Debit Cards)</option>
                                <option value="upi">UPI Payment</option>
                                <option value="cash">Cash On Devilery</option>
                            </select>
                        </div>
                        {
                            this.state.payment !== '...' 
                                        ?
                            <button className='btn btn-outline-success mt-2' onClick={this.handleOrder}>Confirm Order</button>
                                        :
                                     (null)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    cartData : state.cartData
})

const mapDispatchToProps = (dispatch) => ({
    totalOrdersPlaced:(payload) => dispatch(totalOrdersPlaced(payload))
})

export default connect (mapStateToProps,mapDispatchToProps)(Orders)