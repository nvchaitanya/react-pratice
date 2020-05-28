import React from 'react'
import {connect} from 'react-redux'
import {fetchRegister} from '../Redux/Action'

export class Register extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            email:'',
            password:'',
            username:'',
            mobile:'',
            description:''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleRegister = () => {
        let {name,email,password,username,mobile,description} = this.state
        if(name === '' || email === '' || password==='' || username==='' || mobile==='' || description==='') alert('Please fill all the fields !')
        else{
            let data  = {
                name:this.state.name,
                email:this.state.email,
                password:this.state.password,
                username:this.state.username,
                mobile:this.state.mobile,
                description:this.state.description
            }
            this.props.fetchRegister(data)
        }
    }

    render(){
        return(
            <div className='container'>  
                <h2 className='text-center font-weight-bold text-primary shadow'>Registration Page</h2>
                <div className='col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-3 border h5'>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" name='name' value={this.state.name} onChange={this.handleChange} className='form-control mb-3'/>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input type="text" name='email' value={this.state.email} onChange={this.handleChange} className='form-control mb-3'/>
                    </div>
                    <div>
                        <label htmlFor="pwd">Password</label>
                        <input type="password" name='password' value={this.state.password} onChange={this.handleChange} className='form-control mb-3'/>
                    </div>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' value={this.state.username} onChange={this.handleChange} className='form-control mb-3'/>
                    </div>
                    <div>
                        <label htmlFor="phone">Mobile</label>
                        <input type="number" name='mobile' value={this.state.mobile} onChange={this.handleChange} className='form-control mb-3'/>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <input type="text" name='description' value={this.state.description} onChange={this.handleChange} className='form-control mb-3'/>
                    </div>
                    <div className='text-center'>
                        <button className='btn btn-primary' onClick={this.handleRegister}>Register</button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    fetchRegister : (payload) => dispatch(fetchRegister(payload))
})

export default connect(null,mapDispatchToProps)(Register)