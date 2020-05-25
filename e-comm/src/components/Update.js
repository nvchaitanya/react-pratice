import React from 'react'
import { connect } from 'react-redux'
import { editProduct } from '../Redux/Action'

export class Update extends React.Component{
    constructor(props){
        super(props)
        this.state={
            title:'',
            price:0,
            rating:0,
            category:'',
            src:'',
            id:0
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    componentDidMount(){
        let id = this.props.match.params.id
        let data = this.props.data.filter(element => element.id === id)
        console.log('Hi',id)
        this.setState({
            title:data[0].title,
            price:data[0].price,
            rating:data[0].rating,
            category:data[0].category,
            src:data[0].src,
            id:data[0].id
        })
    }
    updateInfo = () => {
        let data={
            title:this.state.title,
            price:this.state.price,
            rating:this.state.rating,
            category:this.state.category,
            src:this.state.src,
            id:this.state.id
        }
        this.props.editProduct(data)
        alert('Data Updated')
    }
    handleGoBack = () => {
        this.props.history.push('/addproduct')
    }
    render(){
        return(
            <div className='container p-5'>
                <button className='btn btn-outline-success' onClick={this.handleGoBack}>Go Back</button>
                <br />
                <div>
                    <label>Product Name</label>
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
                    <input type="src" name='src' value={this.state.src} onChange={this.handleChange} className='form-control mb-2'/>
                </div>
                <button className='btn btn-outline-info' onClick={this.updateInfo}>Update</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    data:state.data
})

const mapDispatchToProps = (dispatch) => ({
    editProduct : (payload) => dispatch(editProduct(payload))
})

export default connect(mapStateToProps,mapDispatchToProps)(Update)