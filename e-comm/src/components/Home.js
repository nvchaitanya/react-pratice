import React from 'react'
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {filter,login,addToCart,incQty,decQty,removeFromCart} from '../Redux/Action'

export class Home extends React.Component{
    constructor(props){
        super(props)
        this.state={

        }
    }
    render(){
        if(this.props.login){
            return(
                <div className='container'>
                    <nav class="navbar navbar-expand-lg navbar-light bg-light">
                        <Link class="navbar-brand" to="/">e-commerce</Link>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav ml-auto">
                                {
                                    this.props.userType==='admin'
                                    ?
                                    (<li className='nav-item active'><Link to='/addproduct' className='nav-link'>Add Product</Link> </li>)
                                    :
                                    (null)
                                }
                                {
                                    this.props.cart && this.props.cartData.length
                                    ?
                                    (<>
                                        <li className='nav-item active'><Link to='/cart' className='nav-link'>Cart</Link></li>
                                        <li className='nav-item active'><Link to='/order' className='nav-link'>Orders</Link></li>
                                    </>)
                                    :
                                    (null)
                                }
                                {
                                    this.props.ordersPlaced.length && this.props.userType==='admin'
                                    ?
                                    (<li className='nav-item active'><Link to='/totalOrdersPlaced' className='nav-link'>Orders Placed</Link></li>)
                                    :
                                    (null)
                                }
                                <li className='nav-item active'><button className='btn btn-outline-danger nav-link' onClick={this.handleLogout}>Logout</button></li>
                            </ul>  
                        </div>
                    </nav>

                    <div>
                        <div className='m-2'>Sort By Category : </div>
                        <select ></select>
                    </div>
                </div>
            )
        }
        else {
            return <Redirect to='/login'/>
        }
    }
}
const mapStateToProps = (state) => ({
   data:state.data,
   userType:state.userType,
   login:state.login,
   cart:state.cart,
   cartData:state.cartData,
   ordersPlaced:state.ordersPlaced
})
const mapDispatchToProps = (dispatch) => ({
   filter:(payload) => dispatch(filter(payload)),
   incQty:(payload) => dispatch(incQty(payload)),
   decQty:(payload) => dispatch(decQty(payload)),
   addToCart:(payload) => dispatch(addToCart(payload)),
   removeFromCart:(payload) => dispatch(removeFromCart(payload))
})
export default connect(mapStateToProps,mapDispatchToProps)(Home)