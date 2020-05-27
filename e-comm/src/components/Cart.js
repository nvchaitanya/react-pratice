import React from 'react'
import { connect } from 'react-redux'
import { incQty,decQty} from '../Redux/Action'

export class Cart extends React.Component{ 

    handleOrder  = () => {
        this.props.history.push('/order')
    }

    handleDec = (id) => {
        this.props.decQty(id)
    }

    handleInc = (id) => {
        this.props.incQty(id)
    }
    
    render(){
        return(
            <div className='container'>
                <div className='p-3 table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {this.props.cartData.map(element => 
                                <tr key={element.id}>
                                    <td>{element.title}</td>
                                    <td className='w-50'>
                                        <button className='btn btn-sm btn-info mr-1' onClick={() => this.handleDec(element.id)}>-</button>
                                        {element.count}
                                        <button className='btn btn-sm btn-info ml-1' onClick={() => this.handleInc(element.id)}>+</button>
                                    </td>
                                    <td>{element.count * element.price}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='mt-2 p-2'>
                    <button className='btn btn-outline-success' onClick={this.handleOrder}>Order Now</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    cart:state.cart,
    cartData: state.cartData,
})

const mapDispatchToProps = (dispatch) => ({
    incQty : (payload) => dispatch(incQty(payload)),
    decQty : (payload) => dispatch(decQty(payload))
})
export default connect(mapStateToProps,mapDispatchToProps)(Cart)