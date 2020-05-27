import React from 'react'
import {Link,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import { filter,addToCart,incQty,decQty,removeFromCart } from '../Redux/Action'

export class Home extends React.Component{

    handleChange = (e) => {
        this.props.filter(e.target.value)
    }

    addToCart = (id) => {
        this.props.addToCart(id)
    }

    handleOrder = () => {
        this.props.history.push('/order')
    }

    handleInc = (id) => {
        this.props.incQty(id)
    }

    handleDec = (id) => {
        this.props.decQty(id)
    }

    handleLogout = () => {
        this.props.history.push('/login')
    }

    handleRemove = (id) => {
        this.props.removeFromCart(id)
    }
    
    render(){
        if(this.props.login){
            return(
                <div className='container'>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link className = "navbar-brand" to="/">E-commerce</Link>
                        <button className = "navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className = "navbar-toggler-icon"></span>
                        </button>

                        <div className = "collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className = "navbar-nav ml-auto">
                                {
                                    this.props.userType ==='admin'
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
                                <li className='nav-item active'><button className='btn btn-outline-danger px-3 nav-link' onClick={this.handleLogout}>Logout</button></li>
                            </ul>  
                        </div>
                    </nav>

                    <div>
                        <div className='m-2'>Sort By Category : </div>
                        <select name='sortByCategory' className='w-25 mt-2 ml-2 form-control' onChange={this.handleChange}>
                            <option value="">All</option>
                            <option value="mobiles">Mobiles</option>
                            <option value="watches">Watches</option>
                        </select>
                    </div>

                    <div className='row'>
                        <div className={this.props.cart && this.props.cartData.length ? 'col-12 col-md-10 col-lg-8' : 'col-12'}>
                            <div className='p-3 row'>
                                {this.props.data.map(e => 
                                    <div className='col-12 col-md-6 col-lg-4 mb-3' key={e.id}>
                                        <img src={e.src} alt="" className='img-fluid img-thumbnail'/>
                                        <div className='p-3'>
                                            <div className='text-dark my-1'>{e.title}</div>
                                            <div className='text-dark font-weight-bold my-1'>Price : {e.price}</div>
                                            <div className='text-success my-1'>Rating : {e.rating}*</div>
                                            <button className='btn btn-outline-primary' onClick={() => this.addToCart(e.id)}>Add to cart</button>
                                        </div>
                                    </div>    
                                )}
                            </div>
                        </div>
                    

                        {this.props.cart 
                            ? 
                        (<div className={this.props.cartData.length === 0 ? 'd-none':'col-12 col-md-8 col-lg-4'}>
                            <div className='p-3'>
                                <h3 className='text-center'>Shopping cart</h3>
                                <table className='table table-responsive border'>
                                    <thead>
                                        <tr className='font-weight-bold'>
                                            <td>Name</td>
                                            <td>Quantity</td>
                                            <td>Price</td>
                                            <td>Delete</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.cartData.map(e => 
                                            <tr key={e.id}>
                                                <td>{e.title}</td>
                                                <td className='d-flex'>
                                                    <button className='btn btn-sm btn-info mr-1' onClick={() => this.handleDec(e.id)}>-</button>
                                                    {e.count}
                                                    <button className='btn btn-sm btn-info ml-1' onClick={() => this.handleInc(e.id)}>+</button>
                                                </td>
                                                <td>{e.price * e.count}</td>
                                                <td><button className='btn btn-danger' onClick={() => this.handleRemove(e.id)}>X</button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className='mt-2 p-2'>
                                <button className='btn btn-outline-success ml-2' onClick={this.handleOrder}>Order Now</button>
                            </div>
                        </div> )
                            :
                        (null)
                        }
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
    login:state.login,
    data:state.tempData,
    cart:state.cart,
    cartData:state.cartData,
    userType:state.userType,
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