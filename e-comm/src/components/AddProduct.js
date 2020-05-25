import React from 'react'
import { connect } from 'react-redux'
import {addProduct , delProduct} from '../Redux/Action'
import { Link } from 'react-router-dom'
import uuid from 'react-uuid'

export class AddProduct extends React.Component{
    constructor(props){
        super(props)
        this.state={
            title:'',
            price:0,
            rating:0,
            category:'',
            src:''
        }
    }
    handleChange= (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    addNewProduct = () => {
        let newProduct = {
            title:this.state.title,
            price:this.state.price,
            rating:this.state.rating,
            category:this.state.category,
            src:this.state.src,
            id:uuid()
        }
        this.props.addProduct(newProduct)
    }
    deleteProduct = (id) => {
        this.props.delProduct(id)
    }
    render(){
        return(
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link className="navbar-brand" to="/">e-commerce</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item active">
                                <Link className="nav-link" to="/addproduct">Add Product</Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/cart">Cart</Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/order">Order</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className='p-3'>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#staticBackdrop">
                        Add New Product
                    </button>
                    
                    <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Add Product</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <label >Product Name</label>
                                <input type="text" name='title' value={this.state.title} onChange={this.handleChange} className='form-control mb-2'/>
                            </div>
                            <div>
                                <label >Price</label>
                                <input type="number" name='price' value={this.state.price} onChange={this.handleChange} className='form-control mb-2'/>
                            </div>
                            <div>
                                <label >Rating</label>
                                <input type="number" name='rating' value={this.state.rating} onChange={this.handleChange} className='form-control mb-2'/>
                            </div>
                            <div>
                                <label >Category</label>
                                <input type="text" name='category' value={this.state.category} onChange={this.handleChange} className='form-control mb-2'/>
                            </div>
                            <div>
                                <label >Image Url</label>
                                <input type="url" name='src' value={this.state.src} onChange={this.handleChange} className='form-control mb-2'/>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.addNewProduct}>Add</button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <table className="table table-responsive m-2">
                    <thead className="bg-primary text-white">
                        <tr>
                            <th>Product Name</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(element=>
                            <tr key={element.id}>
                                <td>{element.title}</td>
                                <td>
                                    <button className='btn btn-outline-warning'>
                                        <Link to={`/addproduct/${element.id}`}>Update</Link>
                                    </button>
                                </td>
                                <td>
                                    <button className='btn btn-outline-danger' onClick={() => this.deleteProduct(element.id)}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    data : state.data
})

const mapDispatchToProps = (dispatch) => ({
    addProduct : (payload) => dispatch(addProduct(payload)),
    delProduct : (payload) => dispatch(delProduct(payload))
})

export default connect(mapStateToProps,mapDispatchToProps)(AddProduct)