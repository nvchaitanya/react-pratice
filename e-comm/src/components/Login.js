import React from 'react'
import { connect } from 'react-redux'
import { login } from '../Redux/Action'

export class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:'',
            userType:''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleLogin = () => {
        let {username,password,userType} = this.state
        if(username === 'user' && password === 'user' && userType === 'user'){
            this.props.login(this.state.userType)
            this.props.history.push('/')
        }
        else if(username === 'admin' && password === 'admin' && userType === 'admin'){
            this.props.login(this.state.userType)
            this.props.history.push('/')
        }
        else{
            alert('Invalid Login Details !')
        }
    }

    render(){
        return(
            <div className="container">
                <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-2 py-4 ">
                <h2>Login</h2>
                    <div>
                        <label className="h5">Username</label>
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="form-control mb-2" placeholder="Enter username"/>
                    </div>
                    <div>
                        <label className="h5">Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control mb-2" placeholder="Enter Password"/>
                    </div>
                    <div>
                        <label className="h5">Type</label>
                        <select onChange={this.handleChange} name='userType' value={this.state.userType} className="form-control mb-3">
                            <option value="--">-- Select --</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <button onClick={this.handleLogin} className="btn btn-outline-primary mb-4 px-4">Login</button>
                    </div>
                    <small className='text-muted'>Note : <br />
                        Admin => username & password : admin<br/>
                        User => username & password : user
                    </small>
                </div>
            </div>
        )

    }
}

const mapDispatchToProps = (dispatch) => ({
    login  : (payload) => dispatch(login(payload))
})

export default connect(null,mapDispatchToProps)(Login)