import React from 'react'
import { connect } from 'react-redux'
import { fetchLogin } from '../Redux/Action'
import { Link } from 'react-router-dom'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleLogin = () => {
        let { username,password } = this.state
        if(username === '' || password === '') alert('Please fill all the fields !')
        else{
            let data = {
                username:this.state.username,
                password :this.state.password
            }
            this.props.fetchLogin(data)
        }
    }

    render(){
        return(
            <div className='container'>
                <h2 className='text-center font-weight-bold text-success shadow'>Login Page</h2>
                <div className='col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 border my-3 h5'>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' value={this.state.username} onChange={this.handleChange} className='form-control my-3'/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' value={this.state.password} onChange={this.handleChange} className='form-control my-3'/>
                    </div>
                    <div className='text-center'>
                        <button className='btn btn-success text-light my-2' onClick={this.handleLogin}>Login</button>
                    </div>
                    <div className='text-center small my-3'>
                        <span>Not Registered ... Then Register by  clicking <Link to='/register'>Signup</Link></span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    fetchLogin : (payload) => dispatch(fetchLogin(payload))
})

export default connect (null,mapDispatchToProps)(Login)